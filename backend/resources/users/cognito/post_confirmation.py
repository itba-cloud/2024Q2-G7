import boto3
import os

dynamodb = boto3.resource('dynamodb')
user_table = os.getenv('USERS_TABLE_NAME', 'users-table')

def createUser(sub, email, name, surname):
    table = dynamodb.Table(user_table)

    # No hace falta verificar que ya exista porque ya esta validado por cognito
    
    user = {
        'PK': 'USERS',
        'id': sub,
        'email': email,
        'name': name,
        'surname': surname
    }

    table.put_item(Item=user)

    return
    

def main(event, context):
    
    userAttributes = event['request']['userAttributes']
    clientMetadata = event['request']['clientMetadata']

    sub = userAttributes['sub']
    email = userAttributes['email']
    role = userAttributes['custom:role']
    name = clientMetadata['name']
    surname = clientMetadata['surname']

    if(role == 'user'):
        createUser(sub, email, name, surname)
    
    return event