import boto3
import base64
import os
import json
from botocore.exceptions import ClientError

def build_response(statusCode, body=None, message=None):
    return {
        'statusCode': statusCode,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, PUT, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body if body else {'message': message})
    }

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")

def main(event, context):
    path_params = event.get('pathParameters') or {}
    experience_id = path_params.get('experience_id')

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})
    
    #TODO validar que exista la experiencia

    #Check header authorization
    headers = event['headers']
    if not headers:
        return build_response(401, {'error': 'Authorization header missing'})

    auth_header = headers.get('Authorization', '')
    if not auth_header:
        return build_response(401, {'error': 'Authorization header missing'})

    # "Bearer <token>"
    token_parts = auth_header.split(' ')
    if len(token_parts) != 2 or token_parts[0].lower() != 'bearer':
        return build_response(401, {'error': 'Invalid Authorization header format'})

    token = token_parts[1]
    try:
        decoded_token = decode_jwt(token)
    except Exception as e:
        return build_response(401, {'error': str(e)})

    #TODO validar que el usuario sea dueño de la imagen 

    bucket_name = os.environ.get('BUCKET_NAME')
    if not bucket_name:
        return build_response(500, message="Bucket name is not configured")

    s3 = boto3.client('s3')

    try:
        body = json.loads(event['body'])
    except KeyError:
        return build_response(400, {'error': 'Request body is missing'})

    image = body.get('image')
    image = image[image.find(",") + 1:]
    content_type = body.get('content_type')
    if not image or not content_type:
        return build_response(400, message="Image data and content type are required")

    try:
        decoded_image = base64.b64decode(image)
    except Exception as e:
        return build_response(400, message=f"Invalid image data: {str(e)}")

    try:
        key = f'experiences/{experience_id}'

        # Verify if already has image
        object_exists = False
        try:
            s3.head_object(Bucket=bucket_name, Key=key)
            object_exists = True
        except ClientError as e:
            if e.response['Error']['Code'] != '404':
                return build_response(500, message=f"Error checking object existence: {str(e)}")

        s3.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=decoded_image,
            ContentType=content_type
        )

        if object_exists:
            return build_response(200, message="Image updated successfully")
        else:
            return build_response(201, message="Image created successfully")

    except ClientError as e:
        return build_response(500, message=f"Failed to upload/update image: {str(e)}")
    except Exception as e:
        return build_response(500, message=f"Unexpected error: {str(e)}")