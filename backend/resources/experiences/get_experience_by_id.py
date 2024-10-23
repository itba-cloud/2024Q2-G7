import boto3
import json
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
    experience_id = path_params.get('experience_id')

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})
    
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(table_name)
    STATUS = 'VERIFIED'

    #TODO hay que hacer lo de aumentar la view si no soy el usuario que la cree
    
    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq(STATUS) & Key('id').eq(experience_id)
        )
        if 'Items' in response and len(response['Items']) > 0:
            return build_response(200, response['Items'][0])
        
        return build_response(404, {'error': 'Experience not found'})

    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})