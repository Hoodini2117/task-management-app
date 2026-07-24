# Terraform backend configuration for Production
# Uncomment and configure the S3 backend when the state bucket is provisioned
# terraform {
#   backend "s3" {
#     bucket         = "taskmanager-terraform-state"
#     key            = "infrastructure/prod/terraform.tfstate"
#     region         = "ap-south-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }
