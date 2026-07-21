# Creates the main VPC
resource "aws_vpc" "main_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

# Creates the internet gateway for public internet access
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "${var.project_name}-${var.environment}-igw"
  }
}

# Allocates an Elastic IP for the NAT Gateway
resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-eip"
  }

  depends_on = [aws_internet_gateway.main_igw]
}

# Creates the NAT Gateway in the first public subnet
resource "aws_nat_gateway" "main_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet[0].id

  tags = {
    Name = "${var.project_name}-${var.environment}-nat"
  }

  depends_on = [aws_internet_gateway.main_igw]
}

# Creates public subnets across availability zones
resource "aws_subnet" "public_subnet" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-public-${var.availability_zones[count.index]}"
    Tier = "Public"
  }
}

# Creates private application subnets across availability zones
resource "aws_subnet" "private_app_subnet" {
  count = length(var.private_app_subnet_cidrs)

  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = var.private_app_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.project_name}-${var.environment}-private-app-${var.availability_zones[count.index]}"
    Tier = "Private-App"
  }
}

# Creates private database subnets across availability zones
resource "aws_subnet" "private_db_subnet" {
  count = length(var.private_db_subnet_cidrs)

  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = var.private_db_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.project_name}-${var.environment}-private-db-${var.availability_zones[count.index]}"
    Tier = "Private-DB"
  }
}

# Creates the public route table with internet gateway route
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-public-rt"
  }
}

# Creates the private route table with NAT gateway route
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main_nat.id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-private-rt"
  }
}

# Associates public subnets with the public route table
resource "aws_route_table_association" "public_rta" {
  count = length(var.public_subnet_cidrs)

  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# Associates private application subnets with the private route table
resource "aws_route_table_association" "private_app_rta" {
  count = length(var.private_app_subnet_cidrs)

  subnet_id      = aws_subnet.private_app_subnet[count.index].id
  route_table_id = aws_route_table.private_rt.id
}

# Associates private database subnets with the private route table
resource "aws_route_table_association" "private_db_rta" {
  count = length(var.private_db_subnet_cidrs)

  subnet_id      = aws_subnet.private_db_subnet[count.index].id
  route_table_id = aws_route_table.private_rt.id
}
