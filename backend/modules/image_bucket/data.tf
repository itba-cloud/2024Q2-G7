data "aws_iam_policy_document" "image" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ]
    resources = [
      "${module.image_bucket.s3_bucket_arn}/*"
    ]

    # No se especifican principals para hacer que el acceso sea público
    effect = "Allow"
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}