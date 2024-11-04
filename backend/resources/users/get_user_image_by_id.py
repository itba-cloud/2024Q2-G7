import boto3
import base64
import os
import json
from botocore.exceptions import ClientError

def build_response(statusCode, body, content_type=None):
    return {
        'statusCode': statusCode,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': content_type if content_type else 'application/json'
        },
        'body': body if content_type else json.dumps(body)
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
 

def main(event, context):
    path_params = event.get('pathParameters') or {}
    user_id = path_params.get('user_id')

    if not user_id:
        return build_response(400, {'error': 'User ID parameter is required'})
    
    user_exists, user = check_user_exists(user_id)
    if not user_exists:
        return build_response(404, {'error': 'User not found'})

    try:
        bucket_name = os.environ.get('BUCKET_NAME')
        s3 = boto3.client('s3')

        key = f'users/{user_id}'

        head_object = s3.head_object(Bucket=bucket_name, Key=key)
        content_type = head_object['ContentType']

        body = s3.get_object(Bucket=bucket_name, Key=key)['Body']
        image_data = body.read()
        encoded_image_data = base64.b64encode(image_data).decode('utf-8')

        data_uri = f"data:{content_type};base64,{encoded_image_data}"
        
        return build_response(200, data_uri, content_type)

    except ClientError as e:
        error_code = e.response['Error']['Code']
        
        if error_code in ['404', 'NoSuchKey']:
            return build_response(404, {'error': 'User image not found'})
        elif error_code == 'AccessDenied':
            return build_response(403, {'error': 'Access denied to the image'})
        else:
            return build_response(500, {'error': f'Failed to get user image: {str(e)}'})
