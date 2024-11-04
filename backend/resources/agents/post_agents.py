import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import base64

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
    email = body.get('email')
    phone = body.get('phone')
    address = body.get('address')
    languages = body.get('languages')
    experience = body.get('experience')
    bio = body.get('bio')
    agency = body.get('agency')
    specialization = body.get('specialization')
    twitter = body.get('twitter')
    instagram = body.get('instagram')

    if name is None:
        errors.append("Name is required")
    if email is None:
        errors.append("Email is required")
    if phone is None:
        errors.append("Phone is required")
    if address is None:
        errors.append("Address is required")
    if languages is None:
        errors.append("Languages is required")
    if experience is None:
        errors.append("Experience is required")
    if bio is None:
        errors.append("Biography is required")

    return errors

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")

def main(event, context):
    headers = event.get('headers')
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

    # Extract agent attributes from the request body
    STATUS = "PENDING"   # Por default se crea aca para ser validado por admin 
    id = decoded_token['sub']
    name = body.get('name')
    email = body.get('email')
    phone = body.get('phone')
    address = body.get('address')
    languages = body.get('languages')
    experience = body.get('experience')
    bio = body.get('bio')
    agency = body.get('agency')
    specialization = body.get('specialization')
    twitter = body.get('twitter')
    instagram = body.get('instagram')
    score = 0
    reviewCount = 0

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', "agents-table")
    table = dynamodb.Table(table_name)
    
    # Check if agent already exists in the table
    try:
        response = table.query(
            KeyConditionExpression=Key('status').eq('VERIFIED') & Key('id').eq(id),
        )
        if response.get('Items'):
            return build_response(400, {'error': 'Agent already exists'})
        
        response = table.query(
            KeyConditionExpression=Key('status').eq('PENDING') & Key('id').eq(id),
        )
        if response.get('Items'):
            return build_response(400, {'error': 'Agent already exists'})
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check agent existence: {str(e)}'})

    # Prepare item to be inserted into DynamoDB
    agent_item = {
        'status': STATUS,
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'address': address,
        'languages': languages,
        'experience': experience,
        'bio': bio,
        'agency': agency,
        'specialization': specialization,
        'twitter': twitter,
        'instagram': instagram,
        'score': score,
        'reviewCount': reviewCount
    }

    try:
        table.put_item(Item=agent_item)
    except ClientError as e:
        return build_response(500, {'error': f'Failed to create agent: {str(e)}'})

    return build_response(201, {
        'message': 'Agent created successfully',
        'id': id
    })
