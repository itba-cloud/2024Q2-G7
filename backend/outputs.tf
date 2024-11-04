output "bucket_website_endpoint" {
  description = "URL of the website"
  value       = module.static_site.bucket_website_endpoint
}

output "api_url" {
  description = "URL of the API"
  value       = module.api_gw.invoke_url
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = module.cognito.user_pool_client_id
}