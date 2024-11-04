resource "aws_dynamodb_table" "this" {
  name         = var.table.table_name
  billing_mode = var.table.billing_mode
  hash_key     = var.table.attributes[var.table.primary_keys.hash_key].name
  range_key    = lookup(var.table.primary_keys, "range_key", null) != null ? var.table.attributes[var.table.primary_keys.range_key].name : null

  dynamic "attribute" {
    for_each = var.table.attributes

    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "local_secondary_index" {
    for_each = lookup(var.table, "local_secondary_indexes", []) != null ? lookup(var.table, "local_secondary_indexes", []) : []

    content {
      name            = local_secondary_index.value.name
      range_key       = var.table.attributes[local_secondary_index.value.range_key].name
      projection_type = local_secondary_index.value.projection_type
    }
  }


  dynamic "global_secondary_index" {
    for_each = lookup(var.table, "global_secondary_index", []) != null ? lookup(var.table, "global_secondary_index", []) : []

    content {
      name            = global_secondary_index.value.name
      hash_key        = var.table.attributes[global_secondary_index.value.hash_key].name
      range_key       = lookup(global_secondary_index.value, "range_key", null) != null ? var.table.attributes[global_secondary_index.value.range_key].name : null
      projection_type = global_secondary_index.value.projection_type
    }
  }

  tags = {
    Name = var.table.table_name
  }
}
