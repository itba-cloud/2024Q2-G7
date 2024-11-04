import json
import boto3
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o) if o % 1 > 0 else int(o)
        return super(DecimalEncoder, self).default(o)

def validate_query_params(query_params):
    errors = []
    page = query_params.get('page')

    if not query_params or ('experience_id' not in query_params and 'user_id' not in query_params and 'agent_id' not in query_params):
        errors.append('ExperienceID, UserID, or AgentID queryparam is required')

    if page:
        try:
            page_value = int(page)
            if page_value < 1:
                errors.append("Invalid page. It should be an integer greater than 0.")
        except ValueError:
            errors.append("Invalid page. It should be a numeric value greater than 0.")

    return errors

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

def main(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('REVIEWS_TABLE_NAME', 'reviews-table')
    table = dynamodb.Table(table_name)

    query_params = event.get('queryStringParameters') or {}

    validation_errors = validate_query_params(query_params)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})

    experience_id = query_params.get('experience_id')
    user_id = query_params.get('user_id')
    agent_id = query_params.get('agent_id')

    key_condition = None
    index_name = None

    if experience_id:
        key_condition = Key('experience_id').eq(experience_id)
        index_name = 'ByExperienceIndex'
    elif user_id:
        key_condition = Key('user_id').eq(user_id)
        index_name = 'ByUserIndex'
    elif agent_id:
        key_condition = Key('agent_id').eq(agent_id)
        index_name = 'ByAgentIndex'

    try:
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression=key_condition,
            ScanIndexForward=False  # Ordenar de más reciente a más antiguo
        )
        
        reviews = response.get('Items', [])
    except Exception as e:
        return build_response(500, {'error': str(e)})
    
    
    if not reviews:
        return build_response(204, {})

    return build_response(200, reviews)
