import json
import boto3
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
import base64
import json

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o) if o % 1 > 0 else int(o)
        return super(DecimalEncoder, self).default(o)

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }   

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")
    
def check_agent_exists(agent_id):
    dynamodb = boto3.resource('dynamodb')
    dynamo_table = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(dynamo_table)
    STATUS = 'VERIFIED'

    try:
        response = table.get_item(
            Key={ 'status': STATUS, 'id': agent_id }
        )
        return response.get('Item') is not None
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check experience existence: {str(e)}'})


def main(event, context):
    path_params = event.get('pathParameters') or {}
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    agent_exists, user = check_agent_exists(agent_id)
    if not agent_exists:
        return build_response(404, {'error': 'Agent not found'})

    headers = event['headers']
    if not headers:
        return build_response(401, {'error': 'Authorization header missing'})

    auth_header = headers.get('Authorization', '')
    if not auth_header:
        return build_response(401, {'error': 'Authorization header missing'})

    # "Bearer <token>"
    token_parts = auth_header.split(' ')
    if len(token_parts) != 2 or token_parts[0].lower() != 'bearer':
        return build_response(401, {'error': 'Invalid Authorization header format'})

    token = token_parts[1]
    try:
        decoded_token = decode_jwt(token)
    except Exception as e:
        return build_response(401, {'error': str(e)})   
    
    if agent_id != decoded_token['sub']:
        return build_response(403, {'error': 'Forbidden'})

    experience_ids = list(user.get('recommended_experiences', set()))  # Convertimos el set a lista
    
    recommended = []
    
    dynamodb = boto3.resource('dynamodb')
    experiences_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(experiences_table)
    STATUS = 'VERIFIED'

    for experience_id in experience_ids:
        try:
            response = table.query(
                IndexName='ByStatusIndex',  
                KeyConditionExpression=Key('status').eq(STATUS) & Key('id').eq(experience_id)
            )
            
            if 'Items' in response and len(response['Items']) > 0:
                recommended.append(response['Items'][0]) 
        except Exception as e:
            return build_response(500, {'error': f'Failed to get agent recommended experiences: {str(e)}'})

    return build_response(200, {'recommended_experiences': list(recommended)})