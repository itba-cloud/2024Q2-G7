module "waf" {
  source = "./modules/waf"

  project_name               = var.project_name
  rate_limit_domestic        = 2500
  geo_domestic_countries     = ["AR", "BR"]
  rate_limit_global          = 600
  geo_excluded_countries     = ["US", "JP"]
  cloudwatch_metrics_enabled = true
  sampled_requests_enabled   = true
  managed_rules = [
    "AWSManagedRulesKnownBadInputsRuleSet",  # Bloquea entradas que se consideran maliciosas (vulnerabilidades en application layer)
    "AWSManagedRulesAmazonIpReputationList", # Bloquea IPs que se encuentran en la lista de reputación de Amazon
    "AWSManagedRulesAnonymousIpList",        # Bloquea solicitudes que provienen de IPs asociadas a proxies anónimos, redes TOR u otros servicios que podrían ocultar la identidad real de un atacante
    #"AWSManagedRulesSQLiRuleSet",            # Protege contra ataques SQLi
    #"AWSManagedRulesLinuxRuleSet",           # Protege contra ataques que son específicos para aplicaciones y sistemas que corren en plataformas Linux
    #"AWSManagedRulesUnixRuleSet",            # Analogo anterior para Unix
    "AWSManagedRulesBotControlRuleSet",      # Proteger contra bots maliciosos
    "AWSManagedRulesCommonRuleSet"           # Protege contra patrones de tráfico web maliciosos comunes (explotación de vulnerabilidades de OWASP)
  ]
}