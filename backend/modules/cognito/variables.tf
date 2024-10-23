variable "project_name" {
  type        = string
  description = "Project name"
}

/* variable "bucket_website_endpoint" {
  type        = string
  description = "URL of the S3 bucket website"
} */

variable "admin_email" {
  type        = string
  description = "Admin users's email"
}

variable "admin_password" {
  type        = string
  description = "Admin users's password"
  sensitive   = true
}

variable "lambdas" {
  type = map(object({
    arn           = string
    function_name = string
  }))
  description = "Map of lambdas with their ARN and function name"
}