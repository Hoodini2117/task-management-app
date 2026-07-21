# Production environment configuration

project_name = "taskmanager"
environment  = "prod"
aws_region   = "ap-south-1"

# VPC
vpc_cidr                 = "10.2.0.0/16"
public_subnet_cidrs      = ["10.2.1.0/24", "10.2.2.0/24"]
private_app_subnet_cidrs = ["10.2.10.0/24", "10.2.11.0/24"]
private_db_subnet_cidrs  = ["10.2.20.0/24", "10.2.21.0/24"]
availability_zones       = ["ap-south-1a", "ap-south-1b"]

# EC2 / Auto Scaling
instance_type        = "t3.medium"
asg_min_size         = 2
asg_max_size         = 4
asg_desired_capacity = 2

# RDS
db_instance_class    = "db.t3.medium"
db_name              = "taskmanager"
db_username          = "dbadmin"
db_allocated_storage = 50
db_engine_version    = "16.4"
db_multi_az          = true

# Application
app_port          = 8000
health_check_path = "/"
