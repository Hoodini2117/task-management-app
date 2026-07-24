#!/bin/bash

set -e

# AWS region
REGION="ap-south-1"

# Auto Scaling Group name
ASG_NAME="taskmanager-dev-asg"

# Production compose file
COMPOSE_FILE="/home/ubuntu/task-management-app/deployment/docker-compose.yml"

echo "========== Deployment Started =========="

# Get running EC2 instance from ASG
echo "Finding EC2 instance..."
echo "=== Available Auto Scaling Groups ==="
aws autoscaling describe-auto-scaling-groups \
  --region "$AWS_REGION" \
  --query "AutoScalingGroups[].AutoScalingGroupName" \
  --output table
INSTANCE_ID=$(aws ec2 describe-instances \
  --region "$REGION" \
  --filters \
    "Name=tag:Name,Values=taskmanager-dev-app-instance" \
    "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --output text)
echo "=== Debug: Auto Scaling Group ==="
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names "$ASG_NAME" \
  --region "$AWS_REGION"

echo ""
echo "=== Debug: Running EC2 Instances ==="
aws ec2 describe-instances \
  --region "$AWS_REGION" \
  --filters Name=instance-state-name,Values=running \
  --query "Reservations[].Instances[].{ID:InstanceId,State:State.Name,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table
# Exit if no instance exists
if [ -z "$INSTANCE_ID" ] || [ "$INSTANCE_ID" = "None" ]; then
    echo "ERROR: No running EC2 instance found."
    exit 1
fi

echo "Instance found: $INSTANCE_ID"

# Wait until SSM reports the instance online
echo "Waiting for SSM Agent..."

until aws ssm describe-instance-information \
    --region "$REGION" \
    --filters "Key=InstanceIds,Values=$INSTANCE_ID" \
    --query "InstanceInformationList[0].PingStatus" \
    --output text | grep -q "Online"
do
    echo "SSM not ready yet..."
    sleep 10
done

echo "SSM Agent is Online."

# Execute deployment commands on EC2
echo "Sending deployment command..."

COMMAND_ID=$(aws ssm send-command \
  --region "$REGION" \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --comment "GitHub Actions Deployment" \
  --parameters "commands=[
'docker compose -f $COMPOSE_FILE pull',
'docker compose -f $COMPOSE_FILE up -d --remove-orphans',
'docker image prune -af'
]" \
  --query "Command.CommandId" \
  --output text)

echo "Command ID: $COMMAND_ID"

# Wait for deployment to complete
echo "Waiting for deployment to finish..."

aws ssm wait command-executed \
    --region "$REGION" \
    --command-id "$COMMAND_ID" \
    --instance-id "$INSTANCE_ID"

# Check deployment status
STATUS=$(aws ssm list-command-invocations \
    --region "$REGION" \
    --command-id "$COMMAND_ID" \
    --details \
    --query "CommandInvocations[0].Status" \
    --output text)

echo "Deployment Status: $STATUS"

# Exit with failure if deployment failed
if [ "$STATUS" != "Success" ]; then
    echo "Deployment Failed!"
    exit 1
fi

echo "Deployment completed successfully."

echo "========== Deployment Finished =========="