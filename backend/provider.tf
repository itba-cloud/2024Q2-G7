provider "aws" {
  region                   = var.aws_region
  profile                  = "default"
  shared_credentials_files = [".aws/credentials", "~/.aws/credentials"]
  #shared_config_files      = [".aws/config", "~/.aws/config"]

  default_tags {
    tags = {
      author     = "g7-getaway"
      created-by = "terraform"
    }
  }
}
