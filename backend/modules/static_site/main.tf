module "logs_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket_prefix                         = local.bucket_logs_name
  force_destroy                         = true
  acl                                   = "log-delivery-write"
  block_public_acls                     = true
  block_public_policy                   = true
  ignore_public_acls                    = true
  restrict_public_buckets               = true
  policy                                = data.aws_iam_policy_document.logs.json
  attach_policy                         = true
  attach_deny_insecure_transport_policy = true
  attach_require_latest_tls_policy      = true
  control_object_ownership              = true
  object_ownership                      = "BucketOwnerPreferred" // TODO check "ObjectWriter"

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  versioning = {
    enabled = true
  }

  tags = {
    Name = local.bucket_logs_name
  }

  lifecycle_rule = [
    {
      id = "log"

      expiration = {
        days = 90
      }

      filter = {
        and = {
          prefix = "log/"

          tags = {
            rule      = "log"
            autoclean = "true"
          }
        }
      }

      status = "Enabled"

      transition = {
        days          = 30
        storage_class = "STANDARD_IA"
      }

      transition = {
        days          = 60
        storage_class = "GLACIER"
      }
    }
  ]
}

module "static_site" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket_prefix = local.bucket_website_name
  #force_destroy = true
  acl                     = null  # "private" si tuviera CDN
  block_public_acls       = false # true si tuviera CDN
  block_public_policy     = false # true si tuviera CDN
  ignore_public_acls      = false # true si tuviera CDN
  restrict_public_buckets = false # true si tuviera CDN
  policy                  = data.aws_iam_policy_document.site.json
  attach_policy           = true
  #attach_deny_insecure_transport_policy = true
  #attach_require_latest_tls_policy      = true
  #control_object_ownership = true
  object_ownership = "ObjectWriter" // TODO check "BucketOwnerPreferred"

  logging = {
    target_bucket = module.logs_bucket.s3_bucket_id
    target_prefix = "log/"
  }

  #NO versionar el bucket S3 que hostea el sitio web
  versioning = {
    enabled    = false
    status     = false
    mfa_delete = false
  }

  website = {
    index_document = "index.html"
    error_document = "index.html"
  }

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name = local.bucket_website_name
  }
}

module "static_site_www_redirect" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket_prefix = local.bucket_redirect_name
  #force_destroy = true
  acl                     = null
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  #policy = ...
  attach_policy = false
  #attach_deny_insecure_transport_policy = true
  #attach_require_latest_tls_policy      = true
  #control_object_ownership = true
  #object_ownership         = "ObjectWriter"

  website = {
    redirect_all_requests_to = {
      host_name = module.static_site.s3_bucket_website_endpoint
    }
  }

  tags = {
    Name = local.bucket_redirect_name
  }
}