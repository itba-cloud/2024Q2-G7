variable "table" {
  type = object({
    table_name   = string
    billing_mode = string
    attributes = map(object({
      name = string
      type = string
    }))
    primary_keys = object({
      hash_key  = string
      range_key = optional(string)
    })
    global_secondary_index = optional(list(object({
      name            = string
      hash_key        = string
      range_key       = optional(string)
      projection_type = string
    })))
    local_secondary_indexes = optional(list(object({
      name            = string
      range_key       = string
      projection_type = string
    })))
  })
  description = "Table attributes"
}
