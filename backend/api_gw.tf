module "api_gw" {
  source = "./modules/api_gw"

  project_name  = var.project_name
  body_path     = "${local.resources_path}/api.openapi.yml"
  user_pool_arn = module.cognito.user_pool_arn
  waf_arn       = module.waf.arn

  lambdas = {
    for k, lambda in local.api_gw_lambdas :
    k => {
      invoke_arn    = module.lambda[k].invoke_arn
      function_name = module.lambda[k].function_name
    }
  }

  depends_on = [
    module.cognito,
    module.waf
  ]
}