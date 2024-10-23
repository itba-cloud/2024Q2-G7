import json
import boto3
import os

def main(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = os.getenv('LOCATION_TABLE_NAME', 'location-table')
    table = dynamodb.Table(table_name)

    file_path = os.getenv('ITEMS_FILE', '/var/task/items.json')
    try:
        with open(file_path, 'r') as f:
            items = json.load(f)
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Failed to load items: {str(e)}'}),
        }

    for item in items:
        table.put_item(Item=item)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Data loaded successfully'}),
    }
