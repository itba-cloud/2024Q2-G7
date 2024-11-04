data "template_file" "open_api" {
  template = file("${var.body_path}")
  vars = merge(
    {
      cognito_user_pool_arn = var.user_pool_arn
    },
    {
      for k, v in var.lambdas :
      k => v.invoke_arn
    }
  )
}