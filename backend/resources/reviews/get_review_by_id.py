import json
import boto3
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
    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('REVIEWS_TABLE_NAME', 'reviews-table')
    table = dynamodb.Table(table_name)

    path_params = event.get('pathParameters') or {}
    review_id = path_params.get('review_id')

    if not review_id:
        return build_response(400, {'error': 'Review ID parameter is required'})

    categories = ['EXPERIENCE', 'AGENT']
    review = None

    for category in categories:
        try:
            response = table.get_item(
                Key={'category': category, 'id': review_id}
            )
            review = response.get('Item', None)
            if review is not None:
                break  # condicion de corte que traiga una asi no sigue buscando

        except Exception as e:
            return build_response(500, {'error': str(e)})

    if review is None:
        return build_response(404, {'error': 'Review not found'})

    return build_response(200, review)

