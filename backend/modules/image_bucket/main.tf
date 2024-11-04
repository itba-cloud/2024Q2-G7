module "image_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket_prefix = local.bucket_name
  #force_destroy = true
  acl                     = null  # TODO check "private" 
  block_public_acls       = false # true
  block_public_policy     = false # true 
  ignore_public_acls      = false # true 
  restrict_public_buckets = false # true
  policy                  = data.aws_iam_policy_document.image.json
  attach_policy           = true
  #attach_deny_insecure_transport_policy = true
  #attach_require_latest_tls_policy      = true
  #control_object_ownership = true
  object_ownership = "ObjectWriter"

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  versioning = {
    enabled    = true
    status     = true
    mfa_delete = false
  }

  tags = {
    Name = local.bucket_name
  }
}