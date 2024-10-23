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
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE',
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

def check_trip_exists(user_id, id):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('TRIPS_TABLE_NAME', 'trips-table')
    table = dynamodb.Table(table_name)

    try:
        response = table.get_item(
            Key={
                'user_id': user_id,
                'id': id
            }
        )
        return 'Item' in response
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check trip existence: {str(e)}'})

def main(event, context):
    path_params = event.get('pathParameters') or {}
    trip_id = path_params.get('trip_id')

    if not trip_id:
        return build_response(400, {'error': 'Trip ID parameter is required'})

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

    trip = check_trip_exists(decoded_token['sub'], trip_id)

    if not trip:
        return build_response(404, {'error': 'Trip not found'})

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('TRIPS_TABLE_NAME', 'trips-table')
    table = dynamodb.Table(table_name)

    try:
        table.delete_item(
            Key={
                'user_id': trip['user_id'],
                'id': trip['id']
            }
        )
        return build_response(200, {'message': 'Trip deleted successfully'})
    except ClientError as e:
        return build_response(500, {'error': f'Failed to delete trip: {str(e)}'})
