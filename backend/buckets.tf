#TODO unificar

module "image_bucket" {
  source = "./modules/image_bucket"

  project_name = var.project_name
  role         = local.role
}

module "static_site" {
  source = "./modules/static_site"

  project_name = var.project_name
  frontend_dir = local.frontend_dir
  role         = local.role
}