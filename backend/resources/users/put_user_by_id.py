import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
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

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")

def validate_body_params(body):
    errors = []

    name = body.get('name')
    surname = body.get('surname')

    if name is None:
        errors.append("Name is required")
    if surname is None:
        errors.append("Surname is required")

    return errors

def check_user_exists(user_id):
    dynamodb = boto3.resource('dynamodb')
    user_table = os.getenv('USERS_TABLE_NAME', 'users-table')
    table = dynamodb.Table(user_table)
    PK = 'USERS'

    try:
        response = table.get_item(
            Key={'PK': PK, 'id': user_id}
        )
        user_item = response.get('Item')
        return bool(user_item), user_item
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check user existence: {str(e)}'})
    

def main(event, context):
    path_params = event.get('pathParameters') or {}
    user_id = path_params.get('user_id')

    if not user_id:
        return build_response(400, {'error': 'User ID parameter is required'})

    user_exists, user = check_user_exists(user_id)
    if not user_exists:
        return build_response(404, {'error': 'User not found'})
    
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

    #TODO validar que el usuario sea el para editarse (que no me edite otro)
    if user_id != decoded_token['sub']:
        return build_response(403, {'error': 'Forbidden'})

    # Parse request body
    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    validation_errors = validate_body_params(body)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('USERS_TABLE_NAME', 'users-table')
    table = dynamodb.Table(table_name)
    PK = 'USERS'

    name = body.get('name')
    surname = body.get('surname')
        
    try:
       table.update_item(
            Key={'PK': PK, 'id': user_id},
            UpdateExpression="SET #name = :name, #surname = :surname", 
            ExpressionAttributeValues={  
                ':name': name,
                ':surname': surname
            },
            ExpressionAttributeNames={  
                '#name': "name",
                '#surname': "surname"
            },
            ConditionExpression=Attr('id').exists() & Attr('name').exists() & Attr('surname').exists()
        )
    except ClientError as e:
        return build_response(500, {'error': f'Failed to update user: {str(e)}'})
    
    # Return success response
    return build_response(200, {
        'message': 'User updated successfully',
        'id': user_id
    })
