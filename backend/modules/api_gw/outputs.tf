output "invoke_url" {
  description = "API gateway invoke url"
  value       = aws_api_gateway_deployment.this.invoke_url
}