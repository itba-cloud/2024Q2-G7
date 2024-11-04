output "bucket_id" {
  description = "Id of the image s3 bucket"
  value       = module.image_bucket.s3_bucket_id
}

output "domain_name" {
  description = "Image bucket domain name"
  value       = module.image_bucket.s3_bucket_bucket_domain_name
}

output "bucket_website_endpoint" {
  description = "URL of the S3 bucket image"
  value       = module.image_bucket.s3_bucket_website_endpoint
}