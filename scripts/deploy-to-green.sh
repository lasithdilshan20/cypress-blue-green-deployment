#!/bin/bash
echo "Deploying to Green environment..."
docker build -t my-app-green .
docker stop my-app-green
docker rm my-app-green
docker run -d -p 3002:3000 --name my-app-green my-app-green
