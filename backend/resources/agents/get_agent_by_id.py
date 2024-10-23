import boto3
import json
from decimal import Decimal
import os

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


def main(event, context):
    path_params = event.get('pathParameters') or {}
    agent_id = path_params.get('agent_id')

    if not agent_id:
        return build_response(400, {'error': 'Agent ID parameter is required'})

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('AGENTS_TABLE_NAME', 'agents-table')
    table = dynamodb.Table(table_name)

    STATUS = 'VERIFIED'

    #TODO estaria bueno que si recibo el token, devolve la info del agente pending asi el usuario puede ver en el front que ya mando la solicitud y sigue pending

    try:
        response = table.get_item(
            Key={ 'status': STATUS, 'id': agent_id }
        )

        agent = response.get('Item', None)  
        if agent == None:
            return build_response(404, {'error': 'Agent not found'})
        
        return build_response(200, agent)

    except Exception as e:
        return build_response(500, {'error': f'Failed to get agent: {str(e)}'})
