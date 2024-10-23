import json
import boto3
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
import base64
import hashlib
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
        'body': json.dumps(body)
    }

def validate_body_params(body):
    errors = []
    name = body.get('name')
    start_date = body.get('startDate')
    end_date = body.get('endDate')

    if name is None:
        errors.append("Name is required")

    if start_date is None:
        errors.append("Start date is required")

    if end_date is None:
        errors.append("End date is required")

    return errors

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

    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    # Validate body parameters
    validation_errors = validate_body_params(body)
    if validation_errors:
        return build_response(400, {'error': validation_errors})

    name = body.get('name')
    start_date = body.get('startDate')
    end_date = body.get('endDate')
    description = body.get('description')
    user_id = decoded_token['sub']
    experiences = set()  

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('TRIPS_TABLE_NAME', 'trips-table')
    table = dynamodb.Table(table_name)

    combined = str(name) + str(user_id) 
    trip_id = hashlib.sha256(combined.encode()).hexdigest()
        
    trip = check_trip_exists(decoded_token['sub'], trip_id)

    if trip:
        return build_response(400, {'error': 'Trip already exists'})

    trip_item = {
        'user_id': user_id,  
        'id': trip_id,  
        'name': name,
        'start_date': start_date,
        'end_date': end_date,
        'description': description,
        'experiences': experiences  
    }

    try:
        table.put_item(Item=trip_item)
    except ClientError as e:
        return build_response(500, {'error': f'Failed to create trip: {str(e)}'})


    return build_response(201, {
        'message': 'Trip created successfully',
        'id': trip_id
    })