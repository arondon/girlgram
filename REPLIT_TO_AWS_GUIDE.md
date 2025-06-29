# Moving GirlGram from Replit to AWS (Free Account Solution)

Since you have a free Replit account, let's move your working GirlGram app to AWS where it can run permanently for free.

## Step 1: Download Your Project from Replit

1. **In your Replit workspace**, look at the left sidebar
2. **Click on "Files"** (folder icon)
3. **Click the three dots (⋯)** next to any file
4. **Select "Download as zip"**
5. **Save the ZIP file** to your computer (remember where you saved it)

## Step 2: Create GitHub Account (5 minutes)

1. **Go to github.com**
2. **Click "Sign up"**
3. **Create username** (like "yourusername-girlgram")
4. **Use your email and create password**
5. **Verify your email**

## Step 3: Upload Your Project to GitHub

1. **Click "Create repository"** (green button)
2. **Repository name**: "girlgram"
3. **Make sure it's Public** ✓
4. **Click "Create repository"**
5. **Click "uploading an existing file"**
6. **Drag your ZIP file** into the browser window
7. **Wait for upload to finish**
8. **Click "Commit changes"**

## Step 4: Create AWS Account

1. **Go to aws.amazon.com**
2. **Click "Create an AWS Account"**
3. **Enter your email** (use same as GitHub)
4. **Choose account type: Personal**
5. **Fill in your information**
6. **Enter credit card** (required but won't be charged - free tier)
7. **Verify phone number**
8. **Choose Basic Support Plan** (free)

## Step 5: Deploy Frontend with AWS Amplify

1. **In AWS Console**, search **"Amplify"**
2. **Click "New app" → "Host web app"**
3. **Choose "GitHub"**
4. **Sign in to GitHub** when prompted
5. **Select your "girlgram" repository**
6. **Click "Next"**
7. **Leave all settings as default**
8. **Click "Save and deploy"**
9. **Wait 5-10 minutes** for deployment

## Step 6: Set Up Database

1. **In AWS Console**, search **"RDS"**
2. **Click "Create database"**
3. **Choose PostgreSQL**
4. **Select "Free tier"** template
5. **Settings**:
   - DB name: `girlgram`
   - Username: `postgres`
   - Password: `girlgram123` (write this down)
6. **Click "Create database"**
7. **Wait 10-15 minutes**

## That's It!

After these steps:
- Your app will be live on a real website
- You'll have a professional database
- Everything runs on AWS free tier (no costs for 12 months)
- Your community platform will be accessible worldwide

## Need Help?

Each step takes just a few minutes. I can walk you through any step that seems confusing.

The hardest part is just creating the accounts - after that, it's mostly clicking "Next" and waiting for things to deploy.

Would you like me to guide you through the first step (downloading from Replit)?