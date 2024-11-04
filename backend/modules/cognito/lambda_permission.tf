resource "aws_lambda_permission" "cognito" {
  for_each = var.lambdas

  statement_id  = "AllowInvokeByCognito"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.this.arn
}