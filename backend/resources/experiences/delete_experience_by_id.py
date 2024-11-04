import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import base64
from decimal import Decimal

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
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body)
    }

def check_experience_exists(experience_id):
    dynamodb = boto3.resource('dynamodb')
    experience_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(experience_table)

    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq('VERIFIED') & Key('id').eq(experience_id)
        )
        if 'Items' in response and len(response['Items']) > 0:
            return response['Items'][0]

        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq('PENDING') & Key('id').eq(experience_id)
        )        
        if 'Items' in response and len(response['Items']) > 0:
            return response['Items'][0]
        
    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})
    
def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")

def main(event, context):
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
    
    path_params = event.get('pathParameters') or {}
    experience_id = path_params.get('experience_id')

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})

    experience = check_experience_exists(experience_id)
    if experience == None:
        return build_response(404, {'error': 'Experience not found'})

    if decoded_token['sub'] != experience['user_id']:
        return build_response(403, {'error': 'Forbidden access to experience'})
    
    try:
        dynamodb = boto3.resource('dynamodb')
        experience_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
        table = dynamodb.Table(experience_table)
        table.delete_item(Key={'category': experience['category'], 'id': experience_id})
    except Exception as e:
        return build_response(500, {'error': f'Failed to delete experience: {str(e)}'})