variable "project_name" {
  type        = string
  description = "Project name"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the vpc"
  default     = "10.0.0.0/16"
}

variable "vpc_az_count" {
  type        = number
  description = "Amount of availability zones to use"
  default     = 2
}

variable "vpc_endpoints" {
  type = list(object({
    service : string,
    type : string
  }))
  description = "VPC endpoints to regional AWS services"
}
