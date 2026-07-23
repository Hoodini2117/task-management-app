# Local values for common resource naming
locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# VPC module
module "vpc" {
  source = "./modules/vpc"

  project_name             = var.project_name
  environment              = var.environment
  vpc_cidr                 = var.vpc_cidr
  public_subnet_cidrs      = var.public_subnet_cidrs
  private_app_subnet_cidrs = var.private_app_subnet_cidrs
  private_db_subnet_cidrs  = var.private_db_subnet_cidrs
  availability_zones       = var.availability_zones
}

# Security Groups module
module "security_groups" {
  source = "./modules/security-groups"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  app_port     = var.app_port
}

# IAM module
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

# ALB module
module "alb" {
  source = "./modules/alb"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_sg_id         = module.security_groups.alb_sg_id
  app_port          = var.app_port
  health_check_path = var.health_check_path
}

# EC2 / Auto Scaling module
module "ec2" {
  source = "./modules/ec2"

  project_name           = var.project_name
  environment            = var.environment
  instance_type          = var.instance_type
  app_sg_id              = module.security_groups.app_sg_id
  private_app_subnet_ids = module.vpc.private_app_subnet_ids
  target_group_arn       = module.alb.target_group_arn
  instance_profile_name  = module.iam.instance_profile_name
  app_port               = var.app_port
  asg_min_size           = var.asg_min_size
  asg_max_size           = var.asg_max_size
  asg_desired_capacity   = var.asg_desired_capacity
  db_endpoint            = module.rds.db_endpoint
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
}

# RDS module
module "rds" {
  source = "./modules/rds"

  project_name          = var.project_name
  environment           = var.environment
  db_instance_class     = var.db_instance_class
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  db_allocated_storage  = var.db_allocated_storage
  db_engine_version     = var.db_engine_version
  db_multi_az           = var.db_multi_az
  db_sg_id              = module.security_groups.db_sg_id
  private_db_subnet_ids = module.vpc.private_db_subnet_ids
}

# Monitoring module
module "monitoring" {
  source = "./modules/monitoring"

  project_name = var.project_name
  environment  = var.environment
  asg_name     = module.ec2.asg_name
}
module "ecr" {
  source = "./modules/ecr"

  backend_repository_name  = "taskly-backend"
  frontend_repository_name = "taskly-frontend"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}
