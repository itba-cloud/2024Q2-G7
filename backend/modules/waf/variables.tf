variable "project_name" {
  description = "Project name"
  type        = string
}

variable "rate_limit_domestic" {
  description = "Request rate limit for domestic traffic"
  type        = number
}

variable "rate_limit_global" {
  description = "Request rate limit for global traffic"
  type        = number
}

variable "geo_domestic_countries" {
  description = "List of country codes to apply domestic rate limits"
  type        = list(string)
  default     = ["AR"]
}

variable "geo_excluded_countries" {
  description = "List of country codes excluded from global rate limit"
  type        = list(string)
}

variable "managed_rules" {
  description = "List of AWS managed rules to apply"
  type        = list(string)
}

variable "cloudwatch_metrics_enabled" {
  description = "Enable CloudWatch metrics for all rules."
  type        = bool
  default     = true
}

variable "sampled_requests_enabled" {
  description = "Enable sampling of requests for all rules."
  type        = bool
  default     = true
}
