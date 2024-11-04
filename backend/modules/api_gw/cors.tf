/* 

# Método OPTIONS para cada recurso
resource "aws_api_gateway_method" "options" {
  for_each = local.api_resources

  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = each.value
  http_method   = "OPTIONS"
  authorization = "NONE"

  lifecycle {
    prevent_destroy = false  # Permite destruir y recrear el método si ya existe
  }
}

# Integración MOCK para cada método OPTIONS
resource "aws_api_gateway_integration" "options" {
  for_each = local.api_resources

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = each.value
  http_method = aws_api_gateway_method.options[each.key].http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# Respuesta del método OPTIONS
resource "aws_api_gateway_method_response" "options" {
  for_each = local.api_resources

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = each.value
  http_method = aws_api_gateway_method.options[each.key].http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Headers" = true
  }

  depends_on = [
    aws_api_gateway_integration.options,
    aws_api_gateway_method.options,
    ]
}

# Respuesta de integración para OPTIONS
resource "aws_api_gateway_integration_response" "options" {
  for_each = local.api_resources

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = each.value
  http_method = aws_api_gateway_method.options[each.key].http_method
  status_code = "200"

  response_templates  = {
    "application/json" = "{\"statusCode\": 200}"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET, POST, PUT, DELETE, OPTIONS'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }

  depends_on = [
    aws_api_gateway_integration.options
  ]
} */