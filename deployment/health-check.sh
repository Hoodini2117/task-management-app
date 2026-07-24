#!/bin/bash

set -e

ALB_URL="taskmanager-dev-alb-467082886.ap-south-1.elb.amazonaws.com"

echo "Checking application health..."

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ALB_URL")

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "Health check passed."
else
    echo "Health check failed. HTTP Status: $HTTP_CODE"
    exit 1
fi