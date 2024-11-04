import json
import boto3
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

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
            'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }

def validate_body_params(body):
    errors = []

    approve = body.get('approve')

    if approve is None and not isinstance(approve, bool):
        errors.append("Approvement is required")
    
    return errors

def main(event, context):
    path_params = event.get('pathParameters') or {}
    experience_id = path_params.get('experience_id')

    if not experience_id:
        return build_response(400, {'error': 'Experience ID parameter is required'})
    
    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})
    
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(table_name)
    
    approve = bool(body.get('approve'))

    if approve:
        try:
            response = table.query(
                IndexName='ByStatusIndex',
                KeyConditionExpression=Key('status').eq('PENDING') & Key('id').eq(experience_id)
            )        
            if not ('Items' in response and len(response['Items']) > 0):
                return build_response(404, {'error': 'Experience not found'})
            
            experience = response['Items'][0]

            experience['status'] = 'VERIFIED'

            try:
                table.put_item(Item=experience)
            except ClientError as e:
                return build_response(500, {'error': f'Failed to update experience: {str(e)}'})
        
            return build_response(200, {'message': f"Experience {experience_id} approved"})

        except Exception as e:
            return build_response(500, {'error': str(e)})
    else:
        #TODO que hacemos, lo borramos o le metemos un DENIED?
        return build_response(200, {'message': f"Experience {experience_id} denied"})

