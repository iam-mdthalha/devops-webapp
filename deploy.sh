#!/bin/bash
set -e

APP="webapp-prod"
IMAGE="jmdthalha/devops-webapp"

echo "🛑 Stopping existing container..."
docker stop $APP 2>/dev/null || true
docker rm $APP 2>/dev/null || true

echo "🐳 Pulling latest image..."
docker pull $IMAGE:latest

echo "🚀 Starting new container..."
docker run -d \
  --name $APP \
  --restart unless-stopped \
  -p 3000:3000 \
  $IMAGE:latest

echo "✅ Deployment complete!"
docker ps | grep $APP
