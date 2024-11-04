import json
import boto3
from decimal import Decimal
import os
from botocore.exceptions import ClientError
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
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }
    
def check_user_exists(user_id):
    dynamodb = boto3.resource('dynamodb')
    user_table = os.getenv('USERS_TABLE_NAME', 'users-table')
    table = dynamodb.Table(user_table)
    PK = 'USERS'

    try:
        response = table.get_item(
            Key={'PK': PK, 'id': user_id}
        )
        user_item = response.get('Item')
        return bool(user_item), user_item
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check user existence: {str(e)}'})

def convert_sets_to_lists(data):
    if isinstance(data, set):
        return list(data)
    elif isinstance(data, dict):
        return {key: convert_sets_to_lists(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_sets_to_lists(item) for item in data]
    return data

def main(event, context):
    path_params = event.get('pathParameters') or {}
    user_id = path_params.get('user_id')

    if not user_id:
        return build_response(400, {'error': 'User ID parameter is required'})

    user_exists, user = check_user_exists(user_id)
    if not user_exists:
        return build_response(404, {'error': 'User not found'})
        
    user = convert_sets_to_lists(user) 
    return build_response(200, user)