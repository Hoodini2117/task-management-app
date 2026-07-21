output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.application_alb.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.application_alb.arn
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.app_tg.arn
}

output "alb_zone_id" {
  description = "Canonical hosted zone ID of the ALB"
  value       = aws_lb.application_alb.zone_id
}
