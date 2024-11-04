locals {
  custom_attributes = {
    role = {
      name                = "role"
      attribute_data_type = "String"
      mutable             = true
      max_length          = "10"
    }
  }
}
