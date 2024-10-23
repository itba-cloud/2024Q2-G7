import json
import boto3
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
import base64
import json

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
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }

def main(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)

    status = 'VERIFIED'

    try:
        response = table.query(
            KeyConditionExpression=Key('status').eq(status)
        )
    except Exception as e:
        return build_response(500, {'error': str(e)})
    
    items = response.get('Items', [])

    if not items:
        return build_response(204, {})

    return build_response(200, items)