variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "IDs of the public subnets for ALB"
  type        = list(string)
}

variable "alb_sg_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "app_port" {
  description = "Port the application listens on"
  type        = number
}

variable "health_check_path" {
  description = "Health check endpoint path"
  type        = string
}
