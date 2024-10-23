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
    
def check_experience_exists(experience_id):
    dynamodb = boto3.resource('dynamodb')
    experience_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(experience_table)

    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq('VERIFIED') & Key('id').eq(experience_id)
        )
        if 'Items' in response and len(response['Items']) > 0:
            return response['Items'][0]

    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})
    
def check_trip_exists(user_id, trip_id):
    dynamodb = boto3.resource('dynamodb')
    experience_table = os.getenv('TRIPS_TABLE_NAME', 'trips-table')
    table = dynamodb.Table(experience_table)

    try:
        response = table.get_item(Key={ 'user_id': user_id, 'id': trip_id })
        return response.get('Item', None)
    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})


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

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")

def main(event, context):
    headers = event['headers']
    if not headers:
        return build_response(401, {'error': 'Authorization header missing'})

    auth_header = headers.get('Authorization', '')
    if not auth_header:
        return build_response(401, {'error': 'Authorization header missing'})

    token_parts = auth_header.split(' ')
    if len(token_parts) != 2 or token_parts[0].lower() != 'bearer':
        return build_response(401, {'error': 'Invalid Authorization header format'})

    token = token_parts[1]
    try:
        decoded_token = decode_jwt(token)
    except Exception as e:
        return build_response(401, {'error': str(e)})
        
    user_id = decoded_token['sub']

    path_params = event.get('pathParameters') or {}
    trip_id = path_params.get('trip_id')
    experience_id = path_params.get('experience_id')

    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    #TODO check value in frontend
    set = body.get('set')

    if not trip_id:
        return build_response(400, {'error': 'Trip ID parameter is required'})

    trip = check_trip_exists(user_id, trip_id)

    if trip is None:
        return build_response(404, {'error': 'Experience not found'})

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})

    experience = check_experience_exists(experience_id)
    if experience is None:
        return build_response(404, {'error': 'Experience not found'})
    
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('TRIPS_TABLE_NAME', 'trips-table')
    table = dynamodb.Table(table_name)

    if set  == 'true':
        try:
            table.update_item(
                Key={ 'user_id': user_id, 'id': trip_id},
                UpdateExpression='ADD experiences :experience_id',
                ExpressionAttributeValues={':experience_id': set([experience_id])},
                ReturnValues="UPDATED_NEW"
            )
            return build_response(200, 'Experience added to trip')

        except ClientError as e:
            return build_response(500, 'Failed to update trip experiences')
    else:
        try:
            table.update_item(
                Key={ 'user_id': user_id, 'id': trip_id},
                UpdateExpression='DELETE experiences :experience_id',
                ExpressionAttributeValues={':experience_id': set([experience_id])},
                ReturnValues="UPDATED_NEW"
            )
            return build_response(200, 'Experience removed from trip')  

        except ClientError as e:
            return build_response(500, 'Failed to update trip experiences')
