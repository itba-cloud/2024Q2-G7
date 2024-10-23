import boto3
import json
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
from urllib.parse import unquote

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body)
    }

def main(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('LOCATION_TABLE_NAME', 'location-table')
    table = dynamodb.Table(table_name)

    try:
        response = table.query(
            KeyConditionExpression=Key('province').eq('PROV')
        )
    except Exception as e:
        return build_response(500, {'error': str(e)})

    items = response.get('Items', [])

    # If no provinces are found, return 204 No Content
    if not items:
        return build_response(204, {})

    # Se usa una provincia PROV dummy para guardar 23 provincias sin usar idx
    provinces = sorted(set(unquote(item['city']) for item in items))

    # Return the provinces as a JSON array
    return build_response(200, provinces)
