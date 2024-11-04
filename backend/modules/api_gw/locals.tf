locals {
  api_name = "${var.project_name}-API"

  api_gateway_responses = {
    "UNAUTHORIZED"           = { status_code = "401", message = "Unauthorized" }
    "ACCESS_DENIED"          = { status_code = "403", message = "Access Denied" }
    "DEFAULT_4XX"            = { status_code = "400", message = "Bad Request" }
    "DEFAULT_5XX"            = { status_code = "500", message = "Internal Server Error" }
    "BAD_REQUEST_BODY"       = { status_code = "400", message = "Bad Request Body" }
    "BAD_REQUEST_PARAMETERS" = { status_code = "400", message = "Bad Request Parameters" }
  }
}