# Easy AWS Deployment Guide for GirlGram (No Command Line)

This guide helps you deploy your GirlGram app using only web browsers and clicking - no typing commands needed.

## What You Need

1. **AWS Account** - Sign up at aws.amazon.com (free)
2. **GitHub Account** - Sign up at github.com (free)
3. **Your project files** (I'll help you get these)

## Step 1: Get Your Code to GitHub

### Option A: Download and Upload (Easiest)
1. Download your project files from Replit:
   - Go to Files panel in Replit
   - Click the three dots menu
   - Select "Download as ZIP"

2. Create new repository on GitHub:
   - Go to github.com, click "New repository"
   - Name it "girlgram"
   - Make it public
   - Click "Create repository"

3. Upload your files:
   - Click "uploading an existing file"
   - Drag and drop your ZIP file
   - Click "Commit changes"

### Option B: Connect Replit to GitHub
1. In Replit, go to Version Control tab
2. Click "Create a Git repository"
3. Connect to GitHub
4. Push your code

## Step 2: Set Up Database on AWS

1. **Go to AWS Console** → Search "RDS"
2. **Click "Create database"**
3. **Choose these settings**:
   - Engine: PostgreSQL
   - Templates: Free tier ✓
   - DB instance identifier: girlgram-db
   - Master username: postgres
   - Auto generate password: ✓ (write it down!)
   - DB instance class: db.t3.micro
   - Storage: 20 GB
   - Public access: Yes ✓

4. **Click "Create database"**
5. **Wait 10-15 minutes** for it to be ready
6. **Copy the endpoint URL** (looks like: girlgram-db.abc123.us-east-1.rds.amazonaws.com)

## Step 3: Deploy Frontend to Amplify

1. **Go to AWS Console** → Search "Amplify"
2. **Click "New app" → "Host web app"**
3. **Connect GitHub**:
   - Choose GitHub
   - Sign in to GitHub
   - Select your "girlgram" repository
   - Choose main branch

4. **Build settings**:
   - Amplify will detect it's a React app automatically
   - Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. **Environment variables**:
   - Add variable: `VITE_API_URL`
   - Value: (we'll add this after backend is deployed)

6. **Click "Save and deploy"**

## Step 4: Deploy Backend to Lambda

This part requires some setup, but I can guide you through it:

1. **Go to AWS Console** → Search "Lambda"
2. **Click "Create function"**
3. **Choose**:
   - Author from scratch
   - Function name: girlgram-api
   - Runtime: Node.js 18.x
   - Architecture: x86_64

4. **Upload your backend code**:
   - I'll prepare a ZIP file for you
   - Upload it through the console

## Step 5: Connect Everything

1. **Get your Lambda URL**
2. **Update Amplify environment**:
   - Go back to Amplify
   - Add your Lambda URL as `VITE_API_URL`
   - Redeploy

## What This Costs (FREE for 12 months)

- **Database**: Free for 750 hours/month
- **Amplify**: Free for 1000 build minutes
- **Lambda**: Free for 1 million requests
- **Total monthly cost**: $0.00

## Ready to Start?

Would you like me to:
1. Help you download your project files?
2. Walk through the GitHub setup?
3. Guide you through the AWS console step by step?

I can break down each step into smaller, easier pieces.