# Complete AWS Deployment Guide for GirlGram

Your GirlGram app is now ready for AWS deployment using the free tier. All configuration files have been created.

## What's Been Set Up

✅ **Serverless Framework configuration** (`serverless.yml`)
✅ **Lambda handler** for backend API (`server/lambda.ts`)
✅ **Amplify build configuration** (`amplify.yml`)
✅ **Build scripts** for production deployment
✅ **Environment variables template** (`aws-setup.env.example`)

## Prerequisites You Need

1. **AWS Account** - Sign up at https://aws.amazon.com
2. **GitHub Account** - To connect with Amplify
3. **AWS CLI** - Download from https://aws.amazon.com/cli/

## Step-by-Step Deployment Process

### Step 1: Set Up AWS Account & CLI

1. Create AWS account (free tier gives 12 months free)
2. Install AWS CLI on your computer
3. Configure AWS CLI with your credentials:
   ```bash
   aws configure
   ```

### Step 2: Create PostgreSQL Database

1. **AWS Console** → **RDS** → **Create Database**
2. **Settings**:
   - Engine: PostgreSQL
   - Template: **Free tier**
   - DB name: `girlgram`
   - Username: `postgres` 
   - Password: (create strong password)
   - Instance: `db.t3.micro`
   - Storage: 20 GB
   - Public access: **Yes**

3. **Security Group**: Allow PostgreSQL (port 5432) from anywhere
4. **Copy the endpoint URL** - you'll need this

### Step 3: Deploy Backend API

1. **Copy environment file**:
   ```bash
   cp aws-setup.env.example .env
   ```

2. **Fill in your values** in `.env`:
   - `DATABASE_URL`: Your RDS PostgreSQL connection string
   - `SESSION_SECRET`: Random 32+ character string
   - `REPL_ID`: Keep from current Replit
   - `REPLIT_DOMAINS`: Your future API domain

3. **Deploy to Lambda**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Copy the API Gateway URL** from the output

### Step 4: Deploy Frontend

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/girlgram.git
   git push -u origin main
   ```

2. **AWS Console** → **Amplify** → **New App**
3. **Connect GitHub repository**
4. **Build settings**: Use the provided `amplify.yml`
5. **Environment variables**:
   - `VITE_API_URL`: Your API Gateway URL from Step 3

### Step 5: Set Up Database Schema

1. **Connect to your RDS database**
2. **Run database migrations**:
   ```bash
   npm run db:push
   ```

## Free Tier Limits (No Cost for 12 Months)

- **RDS**: 750 hours/month PostgreSQL
- **Lambda**: 1M requests/month (forever free)
- **Amplify**: 1000 build minutes/month
- **API Gateway**: 1M API calls/month

## Authentication Configuration

Your app uses Replit Auth. After deployment:

1. **Update REPLIT_DOMAINS** in Lambda environment variables
2. **Add your new domain** to Replit Auth settings
3. **Update callback URLs** in your Replit Auth configuration

## Monitoring & Maintenance

- **CloudWatch Logs**: Monitor Lambda function logs
- **RDS Monitoring**: Track database performance
- **Amplify Console**: Monitor frontend deployments

## Troubleshooting

**Database Connection Issues**: Check security groups allow port 5432
**Auth Issues**: Verify domain configuration in Replit Auth
**Build Failures**: Check environment variables in Amplify

## Ready to Deploy?

All files are configured. You just need to:
1. Set up AWS account
2. Create RDS database
3. Run the deployment script
4. Connect GitHub to Amplify

The total setup time is typically 30-60 minutes for first deployment.