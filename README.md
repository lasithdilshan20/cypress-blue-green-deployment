
# Blue-Green Deployment with Cypress

This repository demonstrates a Blue-Green deployment strategy using Cypress for end-to-end testing. The setup includes Docker containers for isolated environments and GitHub Actions for CI/CD automation.

## Table of Contents

1. [Introduction](#introduction)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Deployment Scripts](#deployment-scripts)
4. [GitHub Actions Workflow](#github-actions-workflow)
5. [Running the Solution](#running-the-solution)
6. [Conclusion](#conclusion)

## Introduction

Blue-Green deployment is a technique that reduces downtime and risk by running two identical production environments, only one of which serves live production traffic. This project demonstrates how to implement Blue-Green deployments with Cypress to ensure the reliability of new versions before switching traffic.

## Infrastructure Setup

### 1. Create Two Identical Local Environments

- Use Docker to create and run Blue and Green environments.
- Build Docker images for both environments using Dockerfiles.
- Run Docker containers on different ports (`3001` for Blue, `3002` for Green).

### 2. Example Dockerfile

Use the same Dockerfile for both environments but build and tag them separately.

```dockerfile
# Dockerfile
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
```

### 3. Build and Run Docker Containers

```bash
# Build images
docker build -t my-app-blue .
docker build -f Dockerfile.green -t my-app-green .

# Run containers
docker run -d -p 3001:3000 --name my-app-blue my-app-blue
docker run -d -p 3002:3000 --name my-app-green my-app-green
```

## Deployment Scripts

### 1. deploy-to-green.sh

Deploy the new version to the Green environment.

```sh
#!/bin/bash
echo "Deploying to Green environment..."
docker build -f Dockerfile.green -t my-app-green .
docker stop my-app-green || true
docker rm my-app-green || true
docker run -d -p 3002:3000 --name my-app-green my-app-green
```

### 2. switch-to-green.sh

Switch traffic to the Green environment.

```sh
#!/bin/bash
echo "Switching traffic to Green environment..."
echo "Please manually update your hosts file or reverse proxy to point to the Green environment (port 3002)."
```

### 3. rollback-to-blue.sh

Rollback to the Blue environment if issues are found.

```sh
#!/bin/bash
echo "Rolling back traffic to Blue environment..."
echo "Please manually update your hosts file or reverse proxy to point back to the Blue environment (port 3001)."
```

## GitHub Actions Workflow

### Workflow File: .github/workflows/blue-green-deployment.yml

Automate the Blue-Green deployment process using GitHub Actions.

```yaml
name: Blue-Green Deployment with Cypress

on: [push, pull_request]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Deploy to Green Environment
        run: ./scripts/deploy-to-green.sh

      - name: Run Cypress Tests on Green Environment
        run: npx cypress run --env CYPRESS_BASE_URL=http://localhost:3002 --spec "cypress/e2e/green-tests.cy.js"

      - name: Switch Traffic to Green Environment
        if: success()
        run: ./scripts/switch-to-green.sh

      - name: Rollback to Blue Environment
        if: failure()
        run: ./scripts/rollback-to-blue.sh
```

## Running the Solution

### Step-by-Step Process

1. **Deploy Initial Version to Blue**: Build and run Docker container for Blue.

```bash
docker build -t my-app-blue .
docker run -d -p 3001:3000 --name my-app-blue my-app-blue
```

2. **Deploy New Version to Green**: Build and run Docker container for Green with new changes.

```bash
docker build -f Dockerfile.green -t my-app-green .
docker run -d -p 3002:3000 --name my-app-green my-app-green
```

3. **Test Green Environment**: Run Cypress tests against Green.

```bash
npx cypress run --env CYPRESS_BASE_URL=http://localhost:3002 --spec "cypress/e2e/green-tests.cy.js"
```

4. **Switch Traffic**: If tests pass, update routing to Green (manual for local setup).

5. **Rollback**: If tests fail, stop Green container and ensure Blue is running.

```bash
docker stop my-app-green
docker rm my-app-green
```

## Conclusion

By following this setup, you can achieve zero downtime deployments and ensure your application is thoroughly tested before switching traffic to the new version. This approach minimizes risk and provides a reliable deployment strategy for your applications.

For more details, refer to the specific scripts and configurations provided in this repository.

Happy deploying!
