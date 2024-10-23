resource "aws_cognito_user" "admin_user" {
  user_pool_id         = aws_cognito_user_pool.this.id
  username             = var.admin_email
  password             = var.admin_password
  force_alias_creation = false

  attributes = {
    email          = var.admin_email
    "custom:role"  = "admin"
    email_verified = true
  }

  lifecycle {
    ignore_changes = [attributes["custom:role"]]
  }

  depends_on = [
    aws_cognito_user_pool_client.this
  ]
}