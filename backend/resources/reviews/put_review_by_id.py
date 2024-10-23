import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import base64

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
        'body': json.dumps(body, cls=DecimalEncoder)
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

    return errors

def check_review_exists(category, review_id):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('REVIEWS_TABLE_NAME', 'reviews-table')
    table = dynamodb.Table(table_name)

    try:
        response = table.get_item(
            Key={'category': category, 'id': review_id}
        )
        return response.get('Item') is not None
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check review existence: {str(e)}'})
    
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
       response = table.get_item(Key={ 'status': STATUS, 'id': agent_id })
       return response.get('Item') is not None
   except ClientError as e:
       return build_response(500, {'error': f'Failed to get agent: {str(e)}'})

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
    path_params = event.get('pathParameters') or {}
    review_id = path_params.get('review_id')

    if not review_id:
        return build_response(400, {'error': 'Review ID parameter is required'})

    # Parse request body
    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
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

    categories = ['EXPERIENCE', 'AGENT']
    review_exists = False
    review = None

    for category in categories:
        review = check_review_exists(category, review_id)
        if review is not None:
            review_exists = True
            break

    if not review_exists:
        return build_response(404, {'error': 'Review not found'})

    if not check_user_exists(user_id):
        return build_response(404, {'error': 'User not found'})
    
    if review['user_id'] != user_id:
        return build_response(403, {'error': 'Forbidden'})

    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    validation_errors = validate_body_params(body)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})

    title = body.get('title')
    description = body.get('description')
    score = int(body.get('score'))

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('REVIEWS_TABLE_NAME', "reviews-table")
    table = dynamodb.Table(table_name)

    review_item = {
        'category': review['category'],
        'id': review['id'],
        'date': review['date'],
        'title': title,
        'description': description,
        'score': score,
        'user_id': review['user_id'],
        'experience_id': review['experience_id'],
        'agent_id': review['agent_id'],
    }

    try:
        table.put_item(Item=review_item)
    except ClientError as e:
        return build_response(500, {'error': f'Failed to update review: {str(e)}'})

    # Update del score solo si cambio
    if review['score'] != score:
        if review['experience_id']:
            experience = check_experience_exists(review['experience_id'])
            update_experience_score(review['experience_id'], experience['category'], score)
        elif review['agent_id']:
            agent = check_agent_exists(review['agent_id'])
            update_agent_score(agent['id'], score)

    return build_response(200, {
        'message': 'Review updated successfully',
        'id': review_id
    })
