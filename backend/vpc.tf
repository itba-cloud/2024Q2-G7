module "vpc" {
  source = "./modules/vpc"

  project_name  = var.project_name
  vpc_cidr      = local.vpc_cidr
  vpc_az_count  = local.vpc_az_count
  vpc_endpoints = local.vpc_endpoints
}