module "dynamodb" {
  for_each = local.tables
  source   = "./modules/dynamodb"

  table = each.value
}