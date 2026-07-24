#!/bin/bash
#
# User Data Script
# Bootstraps an Ubuntu EC2 instance for the Taskly application.
#

set -euo pipefail

# Logging

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

echo "========================================="
echo "Starting EC2 bootstrap..."
echo "Timestamp: $(date)"
echo "========================================="

# Update System

echo "Updating system packages..."

apt-get update -y
apt-get upgrade -y

# Install Required Packages

echo "Installing required packages..."

apt-get install -y \
    ca-certificates \
    curl \
    unzip \
    wget \
    gnupg \
    lsb-release \
    docker.io

# Enable Docker

echo "Configuring Docker..."

systemctl enable docker
systemctl start docker

# Allow Ubuntu user to run Docker without sudo
usermod -aG docker ubuntu

# Install Docker Compose Plugin

echo "Installing Docker Compose..."

DOCKER_CONFIG=$${DOCKER_CONFIG:-/usr/local/lib/docker}
mkdir -p "$${DOCKER_CONFIG}/cli-plugins"

curl -SL \
https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
-o "$${DOCKER_CONFIG}/cli-plugins/docker-compose"

chmod +x "$${DOCKER_CONFIG}/cli-plugins/docker-compose"

# Install AWS CLI v2

echo "Installing AWS CLI..."

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" \
-o "awscliv2.zip"

unzip -q awscliv2.zip

./aws/install

rm -rf aws awscliv2.zip

# Install CloudWatch Agent


echo "Installing CloudWatch Agent..."

wget -q \
https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

dpkg -i -E amazon-cloudwatch-agent.deb

rm -f amazon-cloudwatch-agent.deb

systemctl enable amazon-cloudwatch-agent || true


# Create Application Directories

echo "Creating application directories..."

mkdir -p /opt/taskly
mkdir -p /opt/taskly/logs
mkdir -p /opt/taskly/scripts

chown -R ubuntu:ubuntu /opt/taskly


# Environment Variables

echo "Creating application environment..."

cat >/etc/environment <<EOF
APP_PORT=${app_port}
EOF


# Verify Installations

echo "========================================="
echo "Installed Versions"
echo "========================================="

docker --version
docker compose version
aws --version


# Completion

echo "========================================="
echo "Bootstrap completed successfully!"
echo "Completed at: $(date)"
echo "========================================="