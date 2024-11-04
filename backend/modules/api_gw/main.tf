resource "aws_api_gateway_rest_api" "this" {
  name        = local.api_name
  description = "Getaway's API"
  body        = data.template_file.open_api.rendered
  #binary_media_types = ["*/*"]

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = local.api_name
  }
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.this.body))

    # We deploy the API every time Terraform is applied instead of using the above
    # method of only applying when the body of the api.openapi.yaml is updated.
    # redeployment = "${timestamp()}"
  }

  depends_on = [
    aws_api_gateway_rest_api.this
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = "api"
}

// Basicamente agrega los headers de CORS cuando la API falla antes de hacer el pasamano a la lambda
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-gatewayResponse-definition.html#supported-gateway-response-types
// https://github.com/serverless/serverless/issues/3191
resource "aws_api_gateway_gateway_response" "default" {
  for_each = local.api_gateway_responses

  rest_api_id   = aws_api_gateway_rest_api.this.id
  response_type = each.key
  status_code   = each.value.status_code

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'OPTIONS,GET,POST,PUT,DELETE'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
  }
}