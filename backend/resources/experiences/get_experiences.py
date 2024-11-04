import boto3
import json
from decimal import Decimal
import os
from boto3.dynamodb.conditions import Key, Attr
from urllib.parse import unquote
from datetime import datetime

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o) if o % 1 > 0 else int(o)
        return super(DecimalEncoder, self).default(o)

def validate_query_params(params):
    errors = []
    allowed_categories = ['aventura', 'gastronomia', 'hoteleria', 'relax', 'historico', 'nocturno']
    allowed_orders = ['OrderByAZ', 'OrderByZA', 'OrderByLowPrice', 'OrderByHighPrice', 'OrderByRankAsc', 'OrderByRankDesc', 'OrderByNewest', 'OrderByOldest']

    category = params.get('category')
    name = params.get('name')
    order = params.get('order')
    price = params.get('price')
    score = params.get('score')
    city = params.get('city')
    province = params.get('province')
    page = params.get('page')

    #TODO validar la city y provicne en location table

    if category and category not in allowed_categories:
        errors.append(f"Invalid category. Allowed values are: {', '.join(allowed_categories)}.")

    if order and order not in allowed_orders:
        errors.append(f"Invalid order. Allowed values are: {', '.join(allowed_orders)}.")

    if price and (not price.isdigit() or int(price) < 0):
        errors.append("Invalid price. It should be a non-negative number.")
    if score and (not score.isdigit() or not (1 <= int(score) <= 5)):
        errors.append("Invalid score. It should be an integer between 1 and 5.")
    if page and (not page.isdigit() or int(page) < 1):
        errors.append("Invalid page. It should be an integer greater than 0.")

    return errors

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
    table_name = os.getenv('EXPERIENCES_TABLE_NAME', 'experiences-table')
    table = dynamodb.Table(table_name)

    query_params = event.get('queryStringParameters') or {}

    # Decode city if it is part of the query
    if 'city' in query_params:
        query_params['city'] = unquote(query_params['city'])
    if 'province' in query_params:
        query_params['province'] = unquote(query_params['province'])

    # Validate query parameters
    validation_errors = validate_query_params(query_params)
    if validation_errors:
        return build_response(400, {'errors': validation_errors})

    category = query_params.get('category')
    name = query_params.get('name')
    order = query_params.get('order')
    price = query_params.get('price')
    score = query_params.get('score')
    city = query_params.get('city')
    province = query_params.get('province')
    page = query_params.get('page')
    STATUS = 'VERIFIED'
    OBSERVALE = True

    #TODO ver si manejamos el name

    key_condition = Key('category').eq(category)  
    index_name = None   
    scan_index_forward = None
    filter_expression = []

    filter_expression.append(Attr('status').eq(STATUS))
    filter_expression.append(Attr('observable').eq(OBSERVALE))
    if province:
        filter_expression.append(Attr('province').eq(province))
    if city:
        filter_expression.append(Attr('city').eq(city))
    if price:
        filter_expression.append(Attr('price').lte(int(price)))
    if score:
        filter_expression.append(Attr('score').gte(int(score)))
    #if name:
    #    filter_expression.append(Attr('name').contains(name))

    # Combine all filter expressions using AND
    combined_filter_expression = None
    if filter_expression:
        combined_filter_expression = filter_expression[0]
        for expr in filter_expression[1:]:
            combined_filter_expression = combined_filter_expression & expr

    # TODO si es mejor usar LSI
    #if order == 'OrderByAZ':
    #    index_name = "ByNameIndex"
    #    scan_index_forward = True
    #elif order == 'OrderByZA':
    #    index_name = "ByNameIndex"
    #    scan_index_forward = False
    #elif order == 'OrderByLowPrice':
    #    index_name = "ByPriceIndex"
    #    scan_index_forward = True
    #elif order == 'OrderByHighPrice':
    #    index_name = "ByPriceIndex"
    #    scan_index_forward = False
    #elif order == 'OrderByRankAsc':
    #    index_name = "ByScoreIndex"
    #    scan_index_forward = True
    #elif order == 'OrderByRankDesc':
    #    index_name = "ByScoreIndex"
    #    scan_index_forward = False

    # Execute the query
    try:
        query_kwargs = {
            'KeyConditionExpression': key_condition,
        }
        #if index_name:
        #    query_kwargs['IndexName'] = index_name
        #if scan_index_forward:
        #    query_kwargs['ScanIndexForward'] = scan_index_forward
        if combined_filter_expression:
            query_kwargs['FilterExpression'] = combined_filter_expression
        
        response = table.query(**query_kwargs)
        experiences = response.get('Items', [])

        if not experiences:
            return build_response(204, {})

        # Sort the experiences based on the order parameter
        if order == 'OrderByAZ':
            experiences = sorted(experiences, key=lambda x: x.get('name', ''))
        elif order == 'OrderByZA':
            experiences = sorted(experiences, key=lambda x: x.get('name', ''), reverse=True)
        elif order == 'OrderByLowPrice':
            experiences = sorted(experiences, key=lambda x: x.get('price', 0))
        elif order == 'OrderByHighPrice':
            experiences = sorted(experiences, key=lambda x: x.get('price', 0), reverse=True)
        elif order == 'OrderByRankAsc':
            experiences = sorted(experiences, key=lambda x: x.get('score', 0))
        elif order == 'OrderByRankDesc':
            experiences = sorted(experiences, key=lambda x: x.get('score', 0), reverse=True)
        elif order == 'OrderByNewest':
            experiences = sorted(experiences, key=lambda x: datetime.strptime(x.get('timestamp', ''), "%d-%m-%Y %H:%M:%S"), reverse=True)
        elif order == 'OrderByOldest':
            experiences = sorted(experiences, key=lambda x: datetime.strptime(x.get('timestamp', ''), "%d-%m-%Y %H:%M:%S"))
        
        return build_response(200, experiences)

    except Exception as e:
        return build_response(500, {'error': str(e)})