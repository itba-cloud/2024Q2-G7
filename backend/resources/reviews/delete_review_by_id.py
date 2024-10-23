from decimal import Decimal
import boto3
import json
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import os
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
    
    try:
        response = table.update_item(
            Key={
                'status': 'VERIFIED',
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
    
def delete_review(category, review_id):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('REVIEWS_TABLE_NAME', 'reviews-table')
    table = dynamodb.Table(table_name)

    try:
        table.delete_item(
            Key={'category': category, 'id': review_id }
        )
        return True, None  
    except ClientError as e:
        return False, str(e)

def main(event, context):
    path_params = event.get('pathParameters') or {}
    review_id = path_params.get('review_id')

    if not review_id:
        return build_response(400, {'error': 'Review ID parameter is required'})

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
    
    agent_id = review['agent_id']
    experience_id = review['experience_id']
    score = review['score']
    category = None

    if experience_id is not None:
        category = 'EXPERIENCE'
    elif agent_id is not None:
        category = 'AGENT'

    deletion_success, error_message = delete_review(category, review_id)
    if deletion_success and experience_id:
        experience = check_experience_exists(experience_id)
        update_experience_score(experience_id, experience['category'], score)
        return build_response(200, {'message': 'Experience review deleted successfully'})
    elif deletion_success and agent_id:
        update_agent_score(agent_id, score)
        return build_response(200, {'message': 'Agent review deleted successfully'})
    else:
        return build_response(500, {'error': f'Failed to delete review: {error_message}'})