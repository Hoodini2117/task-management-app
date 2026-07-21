output "db_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.postgres_db.endpoint
}

output "db_name" {
  description = "Name of the database"
  value       = aws_db_instance.postgres_db.db_name
}

output "db_port" {
  description = "Port of the database"
  value       = aws_db_instance.postgres_db.port
}
