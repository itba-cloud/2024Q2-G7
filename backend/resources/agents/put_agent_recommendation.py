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
    agent_table = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(agent_table)
    STATUS = 'VERIFIED'

    try:
        response = table.get_item(
            Key={'status': STATUS, 'id': agent_id}
        )
        agent = response.get('Item')
        return bool(agent), agent
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check user existence: {str(e)}'})
   
    
def check_experience_exists(experience_id):
    dynamodb = boto3.resource('dynamodb')
    experience_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(experience_table)
    STATUS = 'VERIFIED'

    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq(STATUS) & Key('id').eq(experience_id)
        )
        if 'Items' in response and len(response['Items']) > 0:
            return response['Items'][0]
        else:
            return None

    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})


def main(event, context):

    path_params = event.get('pathParameters') or {}
    agent_id = path_params.get('agent_id')
    experience_id = path_params.get('experience_id')

    if not agent_id:
        return build_response(400, {'error': 'User ID parameter is required'})
    
    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})

    agent_exists, agent = check_agent_exists(agent_id)
    if not agent_exists:
        return build_response(404, {'error': 'Agent not found'})
    
    experience = check_experience_exists(experience_id)
    if experience is None:
        return build_response(404, {'error': 'Experience not found'})

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

    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    recommend = bool(body.get('recommend'))
        
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)

    #TODO estaria bueno aumentar el campos 'recommended' de la experiencia para saber cuantos agentes recomendaron

    if recommend:
        try:
            table.update_item(
                Key={'status': 'VERIFIED', 'id': agent_id},
                UpdateExpression='ADD recommended_experiences :experience_id',
                ExpressionAttributeValues={':experience_id': set([experience_id])},
                ReturnValues="UPDATED_NEW"
            )
            return build_response(200, 'Experience added to agent recommended')

        except ClientError as e:
            return build_response(500, 'Failed to update agent recommended experiences')
    else:
        try:
            table.update_item(
                Key={'status': 'VERIFIED', 'id': agent_id},
                UpdateExpression='DELETE recommended_experiences :experience_id',
                ExpressionAttributeValues={':experience_id': set([experience_id])},
                ReturnValues="UPDATED_NEW"
            )
            return build_response(200, 'Experience removed from agent recommended')

        except ClientError as e:
            return build_response(500, 'Failed to update agent recommended experiences')