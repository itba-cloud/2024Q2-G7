module "cognito" {
  source = "./modules/cognito"

  project_name   = var.project_name
  admin_email    = local.admin_email
  admin_password = var.admin_password
  #bucket_website_endpoint = module.static_site.bucket_website_endpoint


  lambdas = {
    for k, lambda in local.cognito_lambdas :
    k => {
      arn           = module.lambda[k].arn
      function_name = module.lambda[k].function_name
    }
  }

  /* depends_on = [
    module.static_site
  ] */
}