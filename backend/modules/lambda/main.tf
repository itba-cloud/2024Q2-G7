resource "aws_lambda_function" "this" {
  filename         = data.archive_file.this.output_path
  function_name    = var.function_name
  handler          = local.handler
  runtime          = var.lambda_info.runtime
  role             = var.lambda_role
  source_code_hash = data.archive_file.this.output_base64sha256
  description      = var.lambda_info.description

  timeout = var.is_folder ? 900 : 30
  #memory_size   = 128

  vpc_config {
    subnet_ids         = var.lambda_subnet_ids
    security_group_ids = var.lambda_sg_ids
  }

  environment {
    variables = var.lambda_info.env_vars
  }

  tags = {
    Name = "${var.function_name}-lambda"
  }

  depends_on = [
    data.archive_file.this
  ]

  lifecycle {
    create_before_destroy = true
  }
}