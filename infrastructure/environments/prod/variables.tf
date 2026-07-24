# -----------------------------------------------------
# General
# -----------------------------------------------------

variable "project_name" {
  description = "Name of the project used for resource naming and tagging"
  type        = string
  default     = "taskmanager"
}

variable "environment" {
  description = "Deployment environment (dev, stage, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "stage", "prod"], var.environment)
    error_message = "Environment must be one of: dev, stage, prod."
  }
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

# -----------------------------------------------------
# VPC and Networking
# -----------------------------------------------------

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_app_subnet_cidrs" {
  description = "CIDR blocks for private application subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "private_db_subnet_cidrs" {
  description = "CIDR blocks for private database subnets"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24"]
}

variable "availability_zones" {
  description = "Availability zones to deploy across"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

# -----------------------------------------------------
# EC2 / Auto Scaling
# -----------------------------------------------------

variable "instance_type" {
  description = "EC2 instance type for application servers"
  type        = string
  default     = "t3.micro"
}

variable "asg_min_size" {
  description = "Minimum number of instances in the Auto Scaling Group"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Maximum number of instances in the Auto Scaling Group"
  type        = number
  default     = 3
}

variable "asg_desired_capacity" {
  description = "Desired number of instances in the Auto Scaling Group"
  type        = number
  default     = 2
}

# -----------------------------------------------------
# RDS
# -----------------------------------------------------

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "taskmanager"
}

variable "db_username" {
  description = "Master username for the RDS instance"
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "Master password for the RDS instance"
  type        = string
  sensitive   = true
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "16.9"
}

variable "db_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = false
}

# -----------------------------------------------------
# Application
# -----------------------------------------------------

variable "app_port" {
  description = "Port the application listens on"
  type        = number
  default     = 8000
}

variable "health_check_path" {
  description = "Health check endpoint path"
  type        = string
  default     = "/"
}
