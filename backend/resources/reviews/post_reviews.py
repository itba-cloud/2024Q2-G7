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
    score = body.get('score')
    experience_id = body.get('experience_id')
    agent_id = body.get('agent_id')

    if title is None:
        errors.append("Title is required")

    if description is None:
        errors.append("Description is required")

    # Score es recibido como int
    if score is None:
        errors.append("Score is required")
    else:
        if score and (not isinstance(score, int) or not (1 <= score <= 5)):
            errors.append("Invalid score. It should be an integer between 1 and 5.")

    if agent_id is None and experience_id is None:
        errors.append("Experience ID or Agent ID is required")

    if agent_id is not None and experience_id is not None:
        errors.append("Experience ID and Agent ID cannot be both provided")

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
        return response.get('Item') is not None
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

def update_experience_score(experience_id, category, review_score):
    dynamodb = boto3.resource('dynamodb')
    dynamo_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(dynamo_table)
    
    try:
        response = table.update_item(
            Key={
                'category': category,
                'id': experience_id
            },
            UpdateExpression="SET score = score + :review_score, reviewCount = reviewCount + :increment",
            ExpressionAttributeValues={
                ':review_score': review_score,
                ':increment': 1
            }
        )
        return response
    except ClientError as e:
        return build_response(500, {'error': f'Failed to update Agent score: {str(e)}'})

def update_agent_score(agent_id, review_score):
    dynamodb = boto3.resource('dynamodb')
    dynamo_table = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(dynamo_table)
    STATUS = 'VERIFIED'
    
    try:
        response = table.update_item(
            Key={
                'status': STATUS,
                'id': agent_id
            },
            UpdateExpression="SET score = score + :review_score, reviewCount = reviewCount + :increment",
            ExpressionAttributeValues={
                ':review_score': review_score,
                ':increment': 1
            }
        )
        return response
    except ClientError as e:
        return build_response(500, {'error': f'Failed to update Agent score: {str(e)}'})

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
    
    validation_errors = validate_body_params(body)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})

    title = body.get('title')
    description = body.get('description')
    score = int(body.get('score'))  # Score es recibido como string TODO
    experience_id = body.get('experience_id')
    agent_id = body.get('agent_id')
    user_id = decoded_token['sub']
    
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('REVIEWS_TABLE_NAME', "reviews-table")
    table = dynamodb.Table(table_name)
    combined = None
    
    if experience_id is not None:
        experience = check_experience_exists(experience_id)
        if experience is None:
            return build_response(404, {'error': 'Experience not found'})
        
        combined = str(user_id) + str(experience_id)
        category = 'EXPERIENCE'
    elif agent_id is not None:
        agent = check_agent_exists(agent_id)
        if agent is None:
            return build_response(404, {'error': 'Agent not found'})
        
        combined = str(user_id) + str(agent_id)
        category = 'AGENT'
    
    review_id = hashlib.sha256(combined.encode()).hexdigest()
    date = datetime.now().strftime("%d-%m-%Y")

    # Check if review_id already exists in the table
    try:
        response = table.get_item(
            Key={'category': category, 'id': review_id}
        )
        if response.get('Item'):
            return build_response(400, {'error': 'Review already exists'})
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check review existence: {str(e)}'})

    review_item = {
        'category': category,
        'id': review_id,
        'date': date,
        'title': title,
        'description': description,
        'score': score,
        'user_id': user_id,
    }

    if experience_id is not None:
        review_item['experience_id'] = experience_id

    if agent_id is not None:
        review_item['agent_id'] = agent_id
    
    try:
        table.put_item(Item=review_item)
    except ClientError as e:
        return build_response(500, {'error': f'Failed to create review: {str(e)}'})

    if experience_id is not None:
        update_experience_score(experience['id'], experience['category'], score)
    elif agent_id is not None:
        update_agent_score(agent_id, score)

    return build_response(201, {
        'message': 'Review created successfully',
        'id': review_id
    })