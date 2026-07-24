# EC2 -> Amazon ECR Read Only Policy

resource "aws_iam_policy" "ecr_pull_policy" {
  name        = "${var.project_name}-${var.environment}-ecr-pull-policy"
  description = "Allows EC2 instances to pull Docker images from Amazon ECR"

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [

      {
        Sid    = "GetAuthorizationToken"
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken"
        ]

        Resource = "*"
      },

      {
        Sid    = "PullImages"
        Effect = "Allow"

        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]

        Resource = "*"
      }

    ]
  })
}
