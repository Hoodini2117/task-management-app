# Creates the DB subnet group across private database subnets
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_db_subnet_ids

  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}

# Creates the PostgreSQL RDS instance
resource "aws_db_instance" "postgres_db" {
  identifier     = "${var.project_name}-${var.environment}-postgres"
  engine         = "postgres"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_allocated_storage * 2
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  multi_az               = var.db_multi_az
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [var.db_sg_id]
  publicly_accessible    = false

  backup_retention_period = 0
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  skip_final_snapshot       = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "${var.project_name}-${var.environment}-final-snapshot" : null
  deletion_protection       = var.environment == "prod"

  performance_insights_enabled = true

  tags = {
    Name = "${var.project_name}-${var.environment}-postgres"
  }
}
