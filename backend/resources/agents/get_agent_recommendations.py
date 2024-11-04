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
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)
    STATUS = 'VERIFIED'

    try:
        response = table.get_item(
            Key={ 'status': STATUS, 'id': agent_id }
        )
        agent_item = response.get('Item')
        return bool(agent_item), agent_item
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check agent existence: {str(e)}'})

def main(event, context):
    path_params = event.get('pathParameters') or {}
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    agent_exists, agent = check_agent_exists(agent_id)
    if not agent_exists:
        return build_response(404, {'error': 'Agent not found'})

    experience_ids = list(agent.get('recommended_experiences', set()))  # Convertimos el set a lista
    
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

    return build_response(200, recommended)