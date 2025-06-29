# Connect girlgram.com to Your AWS Amplify App

## Step 1: Configure Domain in AWS Amplify

**In your AWS Amplify console:**

1. **Go to your girlgram app** in Amplify console
2. **Click "Domain management"** in the left sidebar
3. **Click "Add domain"**
4. **Enter your domain**: `girlgram.com`
5. **Configure subdomains**:
   - `girlgram.com` (root domain)
   - `www.girlgram.com` (www subdomain)
6. **Click "Configure domain"**

AWS will provide you with DNS records to configure.

## Step 2: Configure DNS Records

You'll need to add these records to your domain registrar (where you bought girlgram.com):

**Record Type 1: CNAME (for www)**
- Name: `www`
- Value: (AWS will provide this - looks like: `d17q8eb33dlus1.amplifyapp.com`)

**Record Type 2: ANAME/ALIAS (for root domain)**
- Name: `@` or leave blank
- Value: (AWS will provide this)

**If your registrar doesn't support ANAME:**
- Use `A` record instead
- AWS will provide specific IP addresses

## Step 3: Where to Add DNS Records

### If you bought girlgram.com from:

**GoDaddy:**
1. Log into GoDaddy account
2. Go to "My Products" → "Domains"
3. Click "DNS" next to girlgram.com
4. Add the records AWS provided

**Namecheap:**
1. Log into Namecheap account
2. Go to "Domain List"
3. Click "Manage" next to girlgram.com
4. Go to "Advanced DNS" tab
5. Add the records

**Google Domains:**
1. Log into Google Domains
2. Click on girlgram.com
3. Go to "DNS" section
4. Add custom records

**Other Registrars:**
Look for "DNS Management," "DNS Records," or "Name Servers" section.

## Step 4: Wait for Verification

- **DNS propagation**: 24-48 hours maximum
- **SSL certificate**: AWS creates automatically
- **Status check**: In Amplify console, you'll see verification progress

## Step 5: Update Your App Configuration

Once domain is active, update these:

**Environment Variables (in Amplify):**
- Update any hardcoded URLs to use girlgram.com
- Update authentication redirect URLs

**Replit Auth Configuration:**
- Add girlgram.com to allowed domains
- Update callback URLs to use your custom domain

## Timeline

- **DNS setup**: 5-10 minutes
- **DNS propagation**: 2-24 hours  
- **SSL certificate**: Automatic after DNS resolves
- **Total time**: Usually 2-6 hours

## Troubleshooting

**Domain not working after 24 hours:**
- Check DNS records are exactly as AWS specified
- Verify domain isn't using proxy services (like Cloudflare)

**SSL certificate issues:**
- AWS handles this automatically
- May take additional hour after DNS resolves

## Cost

- **Custom domain on Amplify**: Free
- **SSL certificate**: Free (AWS provides)
- **No additional charges**: Everything included in free tier

Your girlgram.com will then show your beautiful community platform instead of the long AWS URL.