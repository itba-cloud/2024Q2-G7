variable "project_name" {
  type        = string
  description = "Project name"
}

variable "frontend_dir" {
  type        = string
  description = "Path to /build of the static site"
}

variable "role" {
  type        = string
  description = "ARN of IAM role for S3 bucket"
}