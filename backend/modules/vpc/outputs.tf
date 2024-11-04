output "id" {
  description = "Id of the VPC"
  value       = aws_vpc.this.id
}

output "subnets_ids" {
  description = "List of private subnets for Lambda"
  value = [
    for subnet in aws_subnet.private : subnet.id
  ]
}

output "private_rt_id" {
  description = "Private route table id"
  value       = aws_route_table.private.id
}