variable "is_folder" {
  type        = bool
  description = "Wheter only a file or a folder with many files"
  default     = false
}

variable "resources_path" {
  type        = string
  description = "Path to resources"
}

variable "function_name" {
  type        = string
  description = "Lambda function name"
}

variable "lambda_info" {
  type = object({
    entity      = string
    description = string
    runtime     = string
    env_vars    = map(any)
  })
  description = "Data of Lambda function to create"
}

variable "lambda_subnet_ids" {
  type        = list(string)
  description = "List of lambda subnet IDs in the VPC"
}

variable "lambda_sg_ids" {
  type        = list(string)
  description = "ID of the lambda security group"
}

variable "lambda_role" {
  type        = string
  description = "ARN of IAM role for Lambda function"
}