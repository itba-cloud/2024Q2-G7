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

def main(event, context):
    path_params = event.get('pathParameters') or {}
    experience_id = path_params.get('experience_id')

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})
    
    #TODO check experience exists

    try:
        bucket_name = os.environ.get('BUCKET_NAME')
        s3 = boto3.client('s3')

        key = f'experiences/{experience_id}'

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
            return build_response(404, {'error': 'Experience image not found'})
        elif error_code == 'AccessDenied':
            return build_response(403, {'error': 'Access denied to the image'})
        else:
            return build_response(500, {'error': f'Failed to get experience image: {str(e)}'})
