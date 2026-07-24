variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "backend_repository_name" {
  description = "Name of the backend ECR repository"
  type        = string
}

variable "frontend_repository_name" {
  description = "Name of the frontend ECR repository"
  type        = string
}

variable "tags" {
  description = "Tags to apply to ECR repositories"
  type        = map(string)
  default     = {}
}
