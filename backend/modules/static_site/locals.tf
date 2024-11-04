locals {
  bucket_website_name  = "${var.project_name}-website-s3"
  bucket_logs_name     = "${var.project_name}-logs-s3"
  bucket_redirect_name = "www.${local.bucket_website_name}"

  filetypes = {
    "html" : "text/html",
    "jpg" : "image/jpg",
    "jpeg" : "image/jpeg",
    "png" : "image/png",
    "svg" : "image/svg+xml",
    "ico" : "image/x-icon",
    "css" : "text/css",
    "js" : "application/javascript",
    "json" : "application/json",
  }

  file_with_type = flatten([
    for type, mime in local.filetypes : [
      for key, value in fileset("${var.frontend_dir}/", "**/*.${type}") : {
        mime      = mime
        file_name = value
      }
    ]
  ])
}