# Creates the CloudWatch log group for application logs
resource "aws_cloudwatch_log_group" "application_logs" {
  name              = "/${var.project_name}/${var.environment}/application"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-${var.environment}-app-logs"
  }
}

# Creates the SNS topic for alert notifications
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-${var.environment}-alerts"

  tags = {
    Name = "${var.project_name}-${var.environment}-alerts"
  }
}

# Creates a high CPU utilization alarm for the ASG
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-high-cpu"
  alarm_description   = "Triggered when average CPU exceeds 80%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    AutoScalingGroupName = var.asg_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-${var.environment}-high-cpu-alarm"
  }
}

# Creates a high memory utilization alarm (requires CloudWatch agent)
resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "${var.project_name}-${var.environment}-high-memory"
  alarm_description   = "Triggered when average memory exceeds 80%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "mem_used_percent"
  namespace           = "CWAgent"
  period              = 300
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    AutoScalingGroupName = var.asg_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-${var.environment}-high-memory-alarm"
  }
}
