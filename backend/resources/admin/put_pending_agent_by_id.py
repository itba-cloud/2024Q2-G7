import json
import boto3
from decimal import Decimal
import os
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
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    #TODO validar que solo el admin pueda hacer esto
    #user_role = event.get('requestContext', {}).get('authorizer', {}).get('claims', {}).get('custom:role')
    #if user_role != 'admin':
    #    return build_response(403, {'error': 'Forbidden: Only admins can approve agents'})

    # Parse request body
    body = event.get('body')
    if body is None:
        return build_response(400, {'error': 'Request body is missing'})
    
    try:
        body = json.loads(body)
    except json.JSONDecodeError:
        return build_response(400, {'error': 'Invalid JSON format'})

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)

    approve = bool(body.get('approve'))

    if approve:
        try:
            response = table.get_item(
                Key={ 'status': 'PENDING', 'id': agent_id }
            )

            agent = response.get('Item', None)  
            if agent == None:
                return build_response(404, {'error': 'Agent not found'})
            
            try:
                table.delete_item(Key={'status': 'PENDING', 'id': agent_id })
            except ClientError as e:
                return build_response(500, {'error': f'Failed to update agent: {str(e)}'})

            agent['status'] = 'VERIFIED'
            try:
                table.put_item(Item=agent)
            except ClientError as e:
                return build_response(500, {'error': f'Failed to update agent: {str(e)}'})
        
            return build_response(200, {'message': f"Agent {agent_id} approved"})

        except Exception as e:
            return build_response(500, {'error': str(e)})
    else:
        #TODO que hacemos, lo borramos o le metemos un DENIED?
        return build_response(200, {'message': f"Agent {agent_id} denied"})
