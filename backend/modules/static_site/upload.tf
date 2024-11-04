# Uploads files from the frontend build directory to the S3 bucket
resource "aws_s3_object" "static_site" {
  for_each = { for file in local.file_with_type : "${file.file_name}.${file.mime}" => file }

  key    = each.value.file_name
  bucket = module.static_site.s3_bucket_id

  source       = "${var.frontend_dir}/${each.value.file_name}"
  etag         = filemd5("${var.frontend_dir}/${each.value.file_name}")
  content_type = each.value.mime
}