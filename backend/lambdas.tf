module "lambda" {
  for_each = local.lambdas
  source   = "./modules/lambda"

  function_name     = each.key
  lambda_info       = each.value
  lambda_subnet_ids = module.vpc.subnets_ids
  lambda_role       = local.role
  is_folder         = lookup(each.value, "is_folder", false)
  resources_path    = "${local.resources_path}/${each.value.entity}"
  lambda_sg_ids     = lookup(each.value, "is_internal", false) ? [aws_security_group.internal_lambda.id] : [aws_security_group.lambda.id]
}

resource "aws_security_group" "lambda" {
  name        = local.lambda_sg_name
  description = "Enable http/https access on port 80/443 for Lambdas"
  vpc_id      = module.vpc.id

  ingress {
    description = "HTTP access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS access"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.lambda_sg_name
  }
}

resource "aws_security_group" "internal_lambda" {
  name        = local.internal_lambda_sg_name
  description = "Security group for interal use Lambda"
  vpc_id      = module.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.internal_lambda_sg_name
  }
}

//TODO revisar
/* resource "null_resource" "invoke_lambda_location_data_loader" {
  provisioner "local-exec" {
    command = "aws lambda invoke --function-name ${module.lambda["location_data_loader"].function_name } --region ${var.aws_region} NUL"
  }

  depends_on = [
    module.lambda["location_data_loader"],
    module.dynamodb["location"]
  ]

  triggers = {

  }
} */