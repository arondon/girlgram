#!/bin/bash

# GirlGram AWS Deployment Script
echo "Starting GirlGram deployment to AWS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS CLI not configured. Please run 'aws configure' first."
    echo "You need:"
    echo "- AWS Access Key ID"
    echo "- AWS Secret Access Key"
    echo "- Default region: us-east-1"
    exit 1
fi

# Create dist directory
mkdir -p dist

# Build the Lambda function (lightweight build)
echo "Building Lambda function..."
npx esbuild server/lambda.ts --bundle --platform=node --target=node18 --outfile=dist/lambda.js --external:@neondatabase/serverless --external:ws --external:pg-native --format=cjs --define:process.env.NODE_ENV='"production"'

# Deploy backend to AWS Lambda
echo "Deploying backend to AWS Lambda..."
npx serverless deploy

echo "Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Copy the API Gateway URL from the output above"
echo "2. Build frontend locally: npm run build"
echo "3. Deploy frontend to AWS Amplify through the AWS Console"
echo "4. Set VITE_API_URL environment variable in Amplify"