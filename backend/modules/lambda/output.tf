output "function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.this.function_name
}

output "invoke_arn" {
  description = "Invoke ARN of the lambda function"
  value       = aws_lambda_function.this.invoke_arn
}

output "arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.this.arn
}