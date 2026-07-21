variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "db_username" {
  description = "Master username"
  type        = string
}

variable "db_password" {
  description = "Master password"
  type        = string
  sensitive   = true
}

variable "db_allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
}

variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
}

variable "db_multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
}

variable "db_sg_id" {
  description = "ID of the database security group"
  type        = string
}

variable "private_db_subnet_ids" {
  description = "IDs of the private database subnets"
  type        = list(string)
}
