import boto3
import json
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
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }

def check_agent_exists(agent_id):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)
    STATUS = 'VERIFIED'

    try:
        response = table.get_item(
            Key={ 'status': STATUS, 'id': agent_id }
        )
        agent_item = response.get('Item')
        return bool(agent_item), agent_item
    except ClientError as e:
        return build_response(500, {'error': f'Failed to check agent existence: {str(e)}'})

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
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    #TODO estaria bueno que si recibo el token, devolve la info del agente pending asi el usuario puede ver en el front que ya mando la solicitud y sigue pending

    agent_exists, agent = check_agent_exists(agent_id)
    if not agent_exists:
        return build_response(404, {'error': 'Agent not found'})
        
    agent = convert_sets_to_lists(agent) 
    return build_response(200, agent)
