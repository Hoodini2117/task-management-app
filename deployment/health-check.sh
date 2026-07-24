#!/bin/bash

set -e

ALB_URL="http://your-alb-dns.amazonaws.com/health"

echo "Checking application health..."

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ALB_URL")

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "Health check passed."
else
    echo "Health check failed. HTTP Status: $HTTP_CODE"
    exit 1
fi