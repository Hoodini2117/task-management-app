variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "app_sg_id" {
  description = "ID of the application security group"
  type        = string
}

variable "private_app_subnet_ids" {
  description = "IDs of the private application subnets"
  type        = list(string)
}

variable "target_group_arn" {
  description = "ARN of the ALB target group"
  type        = string
}

variable "instance_profile_name" {
  description = "Name of the IAM instance profile"
  type        = string
}

variable "app_port" {
  description = "Port the application listens on"
  type        = number
}

variable "asg_min_size" {
  description = "Minimum number of instances in the ASG"
  type        = number
}

variable "asg_max_size" {
  description = "Maximum number of instances in the ASG"
  type        = number
}

variable "asg_desired_capacity" {
  description = "Desired number of instances in the ASG"
  type        = number
}

variable "db_endpoint" {
  description = "RDS database endpoint"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
