resource "aws_wafv2_web_acl" "this" {
  name        = "${var.project_name}-WAF"
  description = "WAF for ${var.project_name} API"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = var.cloudwatch_metrics_enabled
    metric_name                = "${var.project_name}-WAF-Metrics"
    sampled_requests_enabled   = var.sampled_requests_enabled
  }

  # Mitigar DoS desde IPs en geo_domestic_countries
  # Es decir, si una IP en geo_domestic_countries realiza más de rate_limit_domestic solicitudes en un tiempo determinado, será bloqueada.
  rule {
    name     = "AWSRateBasedRuleDomesticDOS"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit_domestic
        aggregate_key_type = "IP"

        scope_down_statement {
          geo_match_statement {
            country_codes = var.geo_domestic_countries
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = var.cloudwatch_metrics_enabled
      metric_name                = "AWSRateBasedRuleDomesticDOS"
      sampled_requests_enabled   = var.sampled_requests_enabled
    }
  }

  # Mitigar DoS desde todos los paises, exceptos de IPs de geo_excluded_countries
  # Es decir, si una IP que no pertenece a geo_excluded_countries realiza más de rate_limit_global solicitudes, será bloqueada.
  rule {
    name     = "AWSRateBasedRuleGlobalDOS"
    priority = 2

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit_global
        aggregate_key_type = "IP"

        scope_down_statement {
          not_statement {
            statement {
              geo_match_statement {
                country_codes = var.geo_excluded_countries
              }
            }
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = var.cloudwatch_metrics_enabled
      metric_name                = "AWSRateBasedRuleGlobalDOS"
      sampled_requests_enabled   = var.sampled_requests_enabled
    }
  }

  dynamic "rule" {
    for_each = var.managed_rules

    content {
      name     = rule.value
      priority = index(var.managed_rules, rule.value) + 10

      override_action {
        count {}
      }

      statement {
        managed_rule_group_statement {
          name        = rule.value
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = var.cloudwatch_metrics_enabled
        metric_name                = "${rule.value}Metric"
        sampled_requests_enabled   = var.sampled_requests_enabled
      }
    }
  }
}
