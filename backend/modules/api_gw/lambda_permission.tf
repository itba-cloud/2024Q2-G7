resource "aws_lambda_permission" "this" {
  for_each = var.lambdas

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*" # "${aws_api_gateway_rest_api.this.execution_arn}/*/*/*"
}