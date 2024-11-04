import boto3
import json
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
from urllib.parse import unquote

def main(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('LOCATION_TABLE_NAME', 'location-table')
    table = dynamodb.Table(table_name)

    path_params = event.get('pathParameters') or {}
    province_name = path_params.get('province')

    if not province_name:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({"message": "Province is required"})
        }
    
    province_name = unquote(province_name)

    response = table.query(
        KeyConditionExpression=Key('province').eq(province_name)
    )

    items = response.get('Items', [])

    if not items:
        return {
            'statusCode': 204,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
        }

    cities = sorted(set(unquote(item['city']) for item in items))

    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(cities)
    }

    return response
