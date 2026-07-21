output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main_vpc.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public_subnet[*].id
}

output "private_app_subnet_ids" {
  description = "IDs of the private application subnets"
  value       = aws_subnet.private_app_subnet[*].id
}

output "private_db_subnet_ids" {
  description = "IDs of the private database subnets"
  value       = aws_subnet.private_db_subnet[*].id
}

output "igw_id" {
  description = "ID of the internet gateway"
  value       = aws_internet_gateway.main_igw.id
}

output "nat_gw_id" {
  description = "ID of the NAT gateway"
  value       = aws_nat_gateway.main_nat.id
}
