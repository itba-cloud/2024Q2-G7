variable "project_name" {
  type        = string
  description = "Project name"
}

variable "body_path" {
  type        = string
  description = "Path to resources"
}

variable "user_pool_arn" {
  type        = string
  description = "ARN of the Cognito User Pool"
}

variable "waf_arn" {
  type        = string
  description = "ARN of WAF"
}

variable "lambdas" {
  type = map(object({
    invoke_arn    = string
    function_name = string
  }))
  description = "Map of lambdas with their invoke ARN and function name"
}