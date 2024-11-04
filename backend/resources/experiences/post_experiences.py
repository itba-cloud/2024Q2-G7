import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import hashlib
import base64
from datetime import datetime

categories = ['aventura', 'gastronomia', 'hoteleria', 'relax', 'historico', 'nocturno']

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
    category = body.get('category')
    city = body.get('city')
    province = body.get('province')
    address = body.get('address')
    mail = body.get('email')
    price = body.get('price')
    siteUrl = body.get('siteUrl')
    description = body.get('description')

    if name is None:
        errors.append("Name is required")

    if category is None:
        errors.append("Category is required")
    elif category not in categories:
        errors.append(f"Invalid category. Allowed values are: {', '.join(categories)}.")

    if city is None:
        errors.append("City is required")

    if province is None:
        errors.append("Province is required")

    dynamodb = boto3.resource('dynamodb')
    location_table = os.getenv('LOCATION_TABLE_NAME', 'location-table')
    table = dynamodb.Table(location_table)

    try:
        response = table.get_item(Key={'city': city, 'province': province})
        if 'Item' not in response:
            errors.append("Invalid city")
    except Exception as e:
        errors.append(f"Failed to get location: {str(e)}")

    if address is None:
        errors.append("Address is required")

    if mail is None:
        errors.append("Email is required")

    # Price es recibido como int
    if price is not None and (not isinstance(price, int) or price < 0):
        errors.append("Invalid price. It should be a non-negative number.")

    return errors

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

    # Extract experience attributes from the request body
    STATUS = 'PENDING'
    name = body.get('name')
    category = body.get('category')
    city = body.get('city')
    province = body.get('province')
    address = body.get('address')
    email = body.get('email')
    price = body.get('price') if body.get('price') else None    # Price es recibido como int
    siteUrl = body.get('siteUrl')
    description = body.get('description')
    user_id = decoded_token['sub']
    score = 0
    reviewCount = 0
    views = 0
    favs = 0
    recommended = 0
    observable = True
    timestamp = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('EXPERIENCES_TABLE_NAME', "experiences-table")
    table = dynamodb.Table(table_name)
    
    combined = str(name) + str(address) + str(city)
    experience_id = hashlib.sha256(combined.encode()).hexdigest()
    
    # Check if experience_id already exists in the table
    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq('VERIFIED') & Key('id').eq(experience_id)
        )
        if 'Items' in response and len(response['Items']) > 0:
            return build_response(400, {'error': 'Experience already exists'})

        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq('PENDING') & Key('id').eq(experience_id)
        )        
        if 'Items' in response and len(response['Items']) > 0:
            return build_response(400, {'error': 'Experience already exists'})
    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})


    # Prepare item to be inserted into DynamoDB
    experience_item = {
        'status': STATUS,
        'id': experience_id,
        'name': name,
        'address': address,
        'email': email,
        'price': price,
        'description': description,
        'siteUrl': siteUrl,
        'city': city,
        'province': province,
        'category': category,
        'user_id': user_id,
        'score': score,
        'reviewCount': reviewCount,
        'views': views,
        'favs': favs,
        'recommended': recommended,
        'observable': observable,
        'timestamp': timestamp
    }
    
    # Insert item into DynamoDB
    try:
        table.put_item(Item=experience_item)
    except ClientError as e:
        return build_response(500, {'error': f'Failed to create experience: {str(e)}'})

    # Return success response
    return build_response(201, {
        'message': 'Experience created successfully',
        'id': experience_id
    })