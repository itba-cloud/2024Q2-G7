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
    
def check_trip_exists(user_id, trip_id):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('TRIPS_TABLE_NAME', 'trips-table')
    table = dynamodb.Table(table_name)

    try:
        response = table.get_item(
            Key={ 'user_id': user_id, 'id': trip_id }
        )
        trip_item = response.get('Item')
        return bool(trip_item), trip_item
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check trip existence: {str(e)}'})

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
    
    user_id = decoded_token['sub']

    path_params = event.get('pathParameters') or {}
    trip_id = path_params.get('trip_id')

    if not trip_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    trip_exists, trip = check_trip_exists(user_id, trip_id)
    if not trip_exists:
        return build_response(404, {'error': 'Trip not found'})

    experience_ids = list(trip.get('experiences', set()))  # Convertimos el set a lista
    
    experiences = []
    
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
                experiences.append(response['Items'][0]) 
        except Exception as e:
            return build_response(500, {'error': f'Failed to get trip experiences: {str(e)}'})

    return build_response(200, experiences)