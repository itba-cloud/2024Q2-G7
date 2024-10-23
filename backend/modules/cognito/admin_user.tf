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

  //TODO por alguna razon esto no anda
  //El primer apply crea el usuario bien, pero despues si hago otro apply se me borra el rol "admin"
  lifecycle {
    ignore_changes = [attributes["custom:role"]]
  }

  depends_on = [
    aws_cognito_user_pool_client.this
  ]
}