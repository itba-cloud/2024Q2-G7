import json
import boto3
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
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
    table_name = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(table_name)

    STATUS = 'PENDING'

    #TODO validar que solo el admin pueda hacer esto

    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq(STATUS) 
        )        
    except Exception as e:
        return build_response(500, {'error': str(e)})
    
    items = response.get('Items', [])

    if not items:
        return build_response(204, {})

    return build_response(200, items)
