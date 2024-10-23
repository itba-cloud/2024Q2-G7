resource "aws_cognito_user_pool" "this" {
  name = "${var.project_name}-user-pool"

  lambda_config {
    post_confirmation = var.lambdas["post_confirmation"].arn
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = false
    require_symbols                  = false
    require_numbers                  = true
    require_uppercase                = false
    temporary_password_validity_days = 7
  }

  auto_verified_attributes = ["email"]

  dynamic "schema" {
    for_each = local.custom_attributes

    content {
      name                     = schema.value["name"]
      attribute_data_type      = schema.value["attribute_data_type"]
      developer_only_attribute = lookup(schema.value, "developer_only_attribute", false)
      mutable                  = lookup(schema.value, "mutable", true)

      string_attribute_constraints {
        max_length = lookup(schema.value, "max_length", "2048")
        min_length = lookup(schema.value, "min_length", "0")
      }
    }
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${var.project_name}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.this.id

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
  id_token_validity                    = "60"
  access_token_validity                = "60"
  explicit_auth_flows                  = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH", "ALLOW_USER_PASSWORD_AUTH"]
  prevent_user_existence_errors        = "ENABLED"
  read_attributes                      = ["email", "custom:role"]
  write_attributes                     = ["email", "custom:role"]

  // TODO creo que no hace falta porque manejamos todo desde el front y no desde el dominio que nos da cognito
  callback_urls = ["https://${var.bucket_website_endpoint}/"]
  //logout_urls   = ["https://${var.bucket_website_endpoint}/"]

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

// TODO creo que no hace falta porque manejamos todo desde el front y no desde el dominio que nos da cognito
  resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${var.project_name}-user-pool-domain"
  user_pool_id = aws_cognito_user_pool.this.id
} 
