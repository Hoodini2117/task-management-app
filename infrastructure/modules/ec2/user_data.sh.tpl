#!/bin/bash
# User data script for application instance bootstrap

set -euo pipefail

# Update system packages
dnf update -y

# Install Docker
dnf install -y docker
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install CloudWatch agent
dnf install -y amazon-cloudwatch-agent

# Set environment variables for the application
cat > /etc/environment <<EOF
APP_PORT=${app_port}
DATABASE_URL=postgresql://${db_username}:${db_password}@${db_endpoint}/${db_name}
EOF

# Log completion
echo "User data script completed at $(date)" >> /var/log/user-data.log
