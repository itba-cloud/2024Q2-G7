variable "aws_region" {
  type        = string
  description = "AWS Region in which to deploy the application"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Project name"
}

variable "admin_password" {
  type        = string
  description = "Admin users's password"
  sensitive   = true
}