import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import hashlib
import base64
from datetime import datetime

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

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")

def validate_body_params(body):
    errors = []

    title = body.get('title')
    description = body.get('description')

    if title is None:
        errors.append("Title is required")

    if description is None:
        errors.append("Description is required")

    return errors

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
    
    validation_errors = validate_body_params(body)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})

    title = body.get('title')
    description = body.get('description')
    
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('ARTICLES_TABLE_NAME', "articles-table")
    table = dynamodb.Table(table_name)
    combined = str(agent_id) + str(title)
    
    article_id = hashlib.sha256(combined.encode()).hexdigest()
    date = datetime.now().strftime("%d-%m-%Y")

    try:
        response = table.get_item(
            Key={'agent_id': agent_id, 'id': article_id}
        )
        if response.get('Item'):
            return build_response(400, {'error': 'Article already exists'})
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check article existence: {str(e)}'})

    article_item = {
        'id': article_id,
        'date': date,
        'title': title,
        'description': description,
        'agent_id': agent_id,
    }

    try:
        table.put_item(Item=article_item)
    except ClientError as e:
        return build_response(500, {'error': f'Failed to create article: {str(e)}'})

    return build_response(201, {
        'message': 'Article created successfully',
        'id': article_id
    })