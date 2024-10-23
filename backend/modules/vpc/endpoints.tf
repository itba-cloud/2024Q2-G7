resource "aws_vpc_endpoint" "gateway" {
  for_each = var.vpc_endpoints

  vpc_id            = aws_vpc.this.id
  vpc_endpoint_type = each.value.type
  service_name      = "com.amazonaws.${data.aws_region.current.name}.${each.value.service}"
  route_table_ids   = aws_route_table.private[*].id

  timeouts {
    create = "10m"
    update = "10m"
    delete = "10m"
  }

  tags = {
    Name = "${var.project_name}-${each.value.type}-vpc-endpoint-${each.value.service}"
  }
}