data "aws_iam_policy_document" "site" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${module.static_site.s3_bucket_arn}/*"
    ]

    # No se especifican principals para hacer que el acceso sea público
    effect = "Allow"
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

data "aws_iam_policy_document" "logs" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
      "s3:GetObject"
    ]
    resources = [
      "${module.logs_bucket.s3_bucket_arn}",
      "${module.logs_bucket.s3_bucket_arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [var.role]
    }
  }
}