import boto3
import json
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
import base64
from decimal import Decimal

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
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body)
    }

def decode_jwt(token):
    try:
        header, payload, signature = token.split('.')
        decoded_payload = json.loads(base64.urlsafe_b64decode(payload + "==").decode('utf-8'))
        return decoded_payload
    except Exception as e:
        raise Exception(f"Error decoding token: {str(e)}")
    
def validate_body_params(body):
    errors = []

    name = body.get('name')
    email = body.get('email')
    phone = body.get('phone')
    address = body.get('address')
    languages = body.get('languages')
    experience = body.get('experience')
    bio = body.get('bio')
    agency = body.get('agency')
    specialization = body.get('specialization')
    twitter = body.get('twitter')
    instagram = body.get('instagram')

    if name is None:
        errors.append("Name is required")
    if email is None:
        errors.append("Email is required")
    if phone is None:
        errors.append("Phone is required")
    if address is None:
        errors.append("Address is required")
    if languages is None:
        errors.append("Languages is required")
    if experience is None:
        errors.append("Experience is required")
    if bio is None:
        errors.append("Biography is required")

    return errors


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

    # Parse request body
    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    validation_errors = validate_body_params(body)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})
    
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

    #TODO validar que el usuario sea el para editarse (que no me edite otro)

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)
    status = "VERIFIED"

    # Extract agent attributes from the request body
    name = body.get('name')
    email = body.get('email')
    phone = body.get('phone')
    address = body.get('address')
    languages = body.get('languages')
    experience = body.get('experience')
    bio = body.get('bio')
    agency = body.get('agency')
    specialization = body.get('specialization')
    twitter = body.get('twitter')
    instagram = body.get('instagram')
        
    try:
       table.update_item(
            Key={'status': status, 'id': agent_id},
            UpdateExpression="""
                SET #name = :name,
                    #email = :email,
                    #phone = :phone,
                    #address = :address,
                    #languages = :languages,
                    #experience = :experience,
                    #bio = :bio,
                    #agency = :agency,
                    #specialization = :specialization,
                    #twitter = :twitter,
                    #instagram = :instagram
            """, 
            ExpressionAttributeValues={  
                ':name': name,
                ':email': email,
                ':phone': phone,
                ':address': address,
                ':languages': languages,
                ':experience': experience,
                ':bio': bio,
                ':agency': agency,
                ':specialization': specialization,
                ':twitter': twitter,
                ':instagram': instagram
            },
            ExpressionAttributeNames={  
                '#name': "name",
                '#email': "email",
                '#phone': "phone",
                '#address': "address",
                '#languages': "languages",
                '#experience': "experience",
                '#bio': "bio",
                '#agency': "agency",
                '#specialization': "specialization",
                '#twitter': "twitter",
                '#instagram': "instagram"
            },
            ConditionExpression=Attr('id').exists() & Attr('name').exists() & Attr('email').exists() & Attr('phone').exists() & Attr('address').exists() & Attr('languages').exists() & Attr('experience').exists() & Attr('bio').exists()
        )
    except ClientError as e:
        return build_response(500, {'error': f'Failed to update agent: {str(e)}'})
    
    # Return success response
    return build_response(200, {
        'message': 'Agent updated successfully',
        'id': agent_id
    })