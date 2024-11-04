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
    allowed_categories = ['aventura', 'gastronomia', 'hoteleria', 'relax', 'historico', 'nocturno']

    name = body.get('name')
    category = body.get('category')
    city = body.get('city')
    province = body.get('province')
    address = body.get('address')
    mail = body.get('email')
    price = body.get('price')
    siteUrl = body.get('siteUrl')
    description = body.get('description')

    if name is None:
        errors.append("Name is required")

    if category is None:
        errors.append("Category is required")
    elif category not in allowed_categories:
        errors.append(f"Invalid category. Allowed values are: {', '.join(allowed_categories)}.")

    if city is None:
        errors.append("City is required")

    if province is None:
        errors.append("Province is required")

    dynamodb = boto3.resource('dynamodb')
    location_table = os.getenv('LOCATION_TABLE_NAME', 'location-table')
    table = dynamodb.Table(location_table)

    try:
        response = table.get_item(Key={'city': city, 'province': province})
        if 'Item' not in response:
            errors.append("Invalid city")
    except Exception as e:
        errors.append(f"Failed to get location: {str(e)}")

    if address is None:
        errors.append("Address is required")

    if mail is None:
        errors.append("Email is required")

    # Price es recibido como int
    if price is not None and (not isinstance(price, int) or price < 0):
        errors.append("Invalid price. It should be a non-negative number.")

    return errors

def check_experience_exists(experience_id):
    dynamodb = boto3.resource('dynamodb')
    experience_table = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(experience_table)
    STATUS = 'VERIFIED'

    try:
        response = table.query(
            IndexName='ByStatusIndex',
            KeyConditionExpression=Key('status').eq(STATUS) & Key('id').eq(experience_id)
        )
        if 'Items' in response and len(response['Items']) > 0:
            return response['Items'][0]
        else:
            return None

    except Exception as e:
        return build_response(500, {'error': f'Failed to get experience: {str(e)}'})


def main(event, context):
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
    
    path_params = event.get('pathParameters') or {}
    experience_id = path_params.get('experience_id')

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})

    experience = check_experience_exists(experience_id)
    if experience == None:
        return build_response(404, {'error': 'Experience not found'})

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
    
    if decoded_token['sub'] != experience['user_id']:
        return build_response(403, {'error': 'Forbidden access to experience'})

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(table_name)

    name = body.get('name')
    category = body.get('category')
    city = body.get('city')
    province = body.get('province')
    address = body.get('address')
    email = body.get('email')
    price = body.get('price')   # Price es recibido como int
    siteUrl = body.get('siteUrl')
    description = body.get('description')

    # TODO aca hay un problema si cambia la category, porque cambia la PK -> hay que eliminar e insertar devuelta
    try:
       table.update_item(
            Key={'category': experience['category'], 'id': experience['id']},
            UpdateExpression="""
                SET #name = :name,
                    #city = :city,
                    #province = :province,
                    #address = :address,
                    #email = :email,
                    #price = :price,
                    #siteUrl = :siteUrl,
                    #description = :description
            """, 
            ExpressionAttributeValues={  
                ':name': name,
                ':city': city,
                ':province': province,
                ':address': address,
                ':email': email,
                ':price': price,
                ':siteUrl': siteUrl,
                ':description': description
            },
            ExpressionAttributeNames={  
                '#name': "name",
                '#city': "city",
                '#province': "province",
                '#address': "address",
                '#email': "email",
                '#price': "price",
                '#siteUrl': "siteUrl",
                '#description': "description"
            },
            ConditionExpression=Attr('id').exists() & Attr('name').exists() & Attr('category').exists() & Attr('city').exists() & Attr('province').exists() & Attr('address').exists() & Attr('email').exists()
        )
    except ClientError as e:
        return build_response(500, {'error': f'Failed to update experience: {str(e)}'})
    
    # Return success response
    return build_response(200, {
        'message': 'Experience updated successfully',
        'id': experience_id
    })
