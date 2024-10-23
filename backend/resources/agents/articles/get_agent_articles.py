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
    path_params = event.get('pathParameters') or {}
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('ARTICLES_TABLE_NAME', 'articles-table')
    table = dynamodb.Table(table_name)

    try:
        response = table.query(
        KeyConditionExpression=Key('agent_id').eq(agent_id),
    )
    except Exception as e:
        return build_response(500, {'error': str(e)})
    
    items = response.get('Items', [])

    if not items:
        return build_response(204, {})

    return build_response(200, items)
