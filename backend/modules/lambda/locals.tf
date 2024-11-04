locals {
  file_name     = "${var.resources_path}/${var.function_name}.py"
  zip_file_name = "${var.resources_path}/${var.function_name}.zip"
  handler       = "${var.function_name}.main"
}
