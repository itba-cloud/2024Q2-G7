import boto3
import base64
import os
import json
from boto3.dynamodb.conditions import Key
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

def check_agent_exists(agent_id):
    dynamodb = boto3.resource('dynamodb')
    experience_table = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(experience_table)
    STATUS = "VERIFIED"

    try:
        response = table.query(
            KeyConditionExpression=Key('status').eq(STATUS) & Key('id').eq(agent_id),
        )
        return bool(response.get('Items'))
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check agent existence: {str(e)}'})

def main(event, context):
    path_params = event.get('pathParameters') or {}
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})
    
    if not check_agent_exists(agent_id):
        return build_response(404, {'error': 'Agent not found'})

    try:
        bucket_name = os.environ.get('BUCKET_NAME')
        s3 = boto3.client('s3')

        key = f'agents/{agent_id}'

        # Get the object metadata
        head_object = s3.head_object(Bucket=bucket_name, Key=key)
        content_type = head_object['ContentType']

        # Get the image data
        body = s3.get_object(Bucket=bucket_name, Key=key)['Body']
        image_data = body.read()
        encoded_image_data = base64.b64encode(image_data).decode('utf-8')  # Decodificar a string

        # Cambiar el formato del body para imágenes
        data_uri = f"data:{content_type};base64,{encoded_image_data}"
        
        return build_response(200, data_uri, content_type)

    except ClientError as e:
        error_code = e.response['Error']['Code']
        
        if error_code in ['404', 'NoSuchKey']:
            return build_response(404, {'error': 'Agent image not found'})
        elif error_code == 'AccessDenied':
            return build_response(403, {'error': 'Access denied to the image'})
        else:
            return build_response(500, {'error': f'Failed to get agent image: {str(e)}'})
