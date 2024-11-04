data "archive_file" "this" {
  type             = "zip"
  source_file      = var.is_folder ? null : local.file_name
  source_dir       = var.is_folder ? var.resources_path : null
  output_path      = local.zip_file_name
  output_file_mode = "0777"
}