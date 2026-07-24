# Terraform backend configuration
# Uncomment and configure the S3 backend when the state bucket is provisioned
#
# For multi-environment state separation, use partial backend config:
#   terraform init -backend-config="key=infrastructure/${var.environment}/terraform.tfstate"
#
# Or initialize per environment:
#   Dev:     terraform init -backend-config="key=infrastructure/dev/terraform.tfstate"
#   Staging: terraform init -backend-config="key=infrastructure/stage/terraform.tfstate"
#   Prod:    terraform init -backend-config="key=infrastructure/prod/terraform.tfstate"
#
# terraform {
#   backend "s3" {
#     bucket         = "taskmanager-terraform-state"
#     key            = "infrastructure/terraform.tfstate"  # Override per environment via -backend-config
#     region         = "ap-south-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }
