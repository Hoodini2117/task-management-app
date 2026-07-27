#!/bin/bash

set -e

# AWS region
REGION="ap-south-1"

# Auto Scaling Group name
ASG_NAME="taskmanager-dev-asg"

# Production compose file
COMPOSE_FILE="/home/ubuntu/task-management-app/deployment/docker-compose.yml"

echo "========== Deployment Started =========="

echo "Finding EC2 instances..."

echo "=== Available Auto Scaling Groups ==="
aws autoscaling describe-auto-scaling-groups \
  --region "$REGION" \
  --query "AutoScalingGroups[].AutoScalingGroupName" \
  --output table

# ============================================================
# CHANGE:
# Instead of selecting the first running EC2 instance by tag,
# query the Auto Scaling Group and retrieve ONLY the instances
# that are currently InService.
#
# This prevents deploying to instances that are Terminating.
# ============================================================
INSTANCE_IDS=$(aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names "$ASG_NAME" \
  --region "$REGION" \
  --query "AutoScalingGroups[0].Instances[?LifecycleState=='InService'].InstanceId" \
  --output text)

echo "=== Debug: Auto Scaling Group ==="
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names "$ASG_NAME" \
  --region "$REGION"

echo ""
echo "=== Debug: Running EC2 Instances ==="
aws ec2 describe-instances \
  --region "$REGION" \
  --filters Name=instance-state-name,Values=running \
  --query "Reservations[].Instances[].{ID:InstanceId,State:State.Name,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table

# ============================================================
# CHANGE:
# Check INSTANCE_IDS instead of INSTANCE_ID because we're now
# deploying to every healthy InService instance.
# ============================================================
if [ -z "$INSTANCE_IDS" ] || [ "$INSTANCE_IDS" = "None" ]; then
    echo "ERROR: No InService EC2 instances found."
    exit 1
fi

echo ""
echo "Instances selected for deployment:"
echo "$INSTANCE_IDS"

# ============================================================
# CHANGE:
# Loop through every InService instance.
#
# This ensures all active instances behind the ALB receive the
# latest deployment.
# ============================================================
for INSTANCE_ID in $INSTANCE_IDS
do
    echo ""
    echo "===================================="
    echo "Deploying to: $INSTANCE_ID"
    echo "===================================="

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

    echo "Waiting for deployment to finish..."

    aws ssm wait command-executed \
        --region "$REGION" \
        --command-id "$COMMAND_ID" \
        --instance-id "$INSTANCE_ID"

    STATUS=$(aws ssm list-command-invocations \
        --region "$REGION" \
        --command-id "$COMMAND_ID" \
        --details \
        --query "CommandInvocations[0].Status" \
        --output text)

    echo "Deployment Status on $INSTANCE_ID: $STATUS"

    if [ "$STATUS" != "Success" ]; then
        echo "Deployment failed on $INSTANCE_ID"
        exit 1
    fi

    echo "Deployment completed successfully on $INSTANCE_ID"

done

echo ""
echo "===================================="
echo "Deployment completed on all instances."
echo "===================================="

echo "========== Deployment Finished =========="