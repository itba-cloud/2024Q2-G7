import json
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import os

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
    article_id = path_params.get('article_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})
    
    if not article_id:
        return build_response(400, {'error': 'Article ID parameter is required'})
    
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('ARTICLES_TABLE_NAME', 'articles-table')
    table = dynamodb.Table(table_name)

    try:
        response = table.get_item(
            Key={'agent_id': agent_id, 'id': article_id}
        )

        article = response.get('Item', None)  
        if article == None:
            return build_response(404, {'error': 'Article not found'})
        
        return build_response(200, article)

    except Exception as e:
        return build_response(500, {'error': f'Failed to get article: {str(e)}'})