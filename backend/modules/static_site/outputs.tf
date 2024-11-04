output "bucket_id" {
  description = "Id of the website S3 bucket"
  value       = module.static_site.s3_bucket_id
}

output "domain_name" {
  description = "Website bucket domain name"
  value       = module.static_site.s3_bucket_bucket_domain_name
}

output "logs_bucket_domain_name" {
  description = "Logs bucket domain name"
  value       = module.logs_bucket.s3_bucket_bucket_domain_name
}

output "bucket_website_endpoint" {
  description = "URL of the S3 bucket website"
  value       = module.static_site.s3_bucket_website_endpoint
}