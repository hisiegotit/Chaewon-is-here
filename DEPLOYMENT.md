# GitHub Action Auto-Deployment Setup Guide

This guide will help you set up automatic deployment of your Discord bot when code is pushed to the master branch.

## Prerequisites

1. A server (VPS, cloud instance, etc.) running Linux
2. SSH access to your server
3. Node.js and npm installed on your server
4. Git installed on your server

## Step 1: Install PM2 on Your Server

SSH into your server and install PM2 (Process Manager):

```bash
npm install -g pm2
```

PM2 will keep your bot running and make it easy to restart.

## Step 2: Clone Your Repository on the Server

```bash
cd /path/to/your/projects
git clone https://github.com/hisiegotit/Chaewon-is-here.git
cd Chaewon-is-here
npm install
```

## Step 3: Set Up Environment Variables on Server

Create a `.env` file on your server:

```bash
nano .env
```

Add your Discord bot token:

```
DISCORD_BOT_TOKEN=your_token_here
```

## Step 4: Start the Bot with PM2

```bash
pm2 start index.js --name chaewon-bot
pm2 save
pm2 startup
```

The last command will give you a command to run (copy and paste it) to make PM2 start on server reboot.

## Step 5: Generate SSH Key for GitHub Actions

On your **local machine** or **GitHub Actions server**, generate an SSH key pair:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

Save it to a file like `~/.ssh/github_actions_key` (don't set a passphrase).

## Step 6: Add Public Key to Server

Copy the public key to your server:

```bash
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server-ip
```

Or manually add the contents of `github_actions_key.pub` to `~/.ssh/authorized_keys` on your server.

## Step 7: Add Secrets to GitHub Repository

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

1. **SSH_PRIVATE_KEY**: 
   - Content of your private key file (`cat ~/.ssh/github_actions_key`)
   - Copy the entire content including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

2. **SERVER_HOST**: 
   - Your server IP address or domain (e.g., `123.45.67.89` or `bot.example.com`)

3. **SERVER_USERNAME**: 
   - Your SSH username (e.g., `ubuntu`, `root`, or your username)

4. **SERVER_PORT** (optional): 
   - SSH port (default is 22, only add if using a different port)

5. **PROJECT_PATH**: 
   - Full path to your project on the server (e.g., `/home/ubuntu/Chaewon-is-here`)

## Step 8: Test the Deployment

1. Make a small change to your code
2. Commit and push to master:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin master
   ```
3. Go to GitHub → Actions tab to see the deployment workflow running

## Useful PM2 Commands

```bash
# View bot status
pm2 status

# View bot logs
pm2 logs chaewon-bot

# Restart bot manually
pm2 restart chaewon-bot

# Stop bot
pm2 stop chaewon-bot

# Delete bot from PM2
pm2 delete chaewon-bot
```

## Troubleshooting

### Deployment fails with "Permission denied"
- Check that the SSH private key is correctly added to GitHub secrets
- Verify the public key is in `~/.ssh/authorized_keys` on your server

### Bot doesn't restart
- Check PM2 logs: `pm2 logs chaewon-bot`
- Ensure PM2 is installed globally: `npm list -g pm2`

### Git pull fails
- Make sure your server has access to the GitHub repository
- You may need to set up SSH keys on the server for GitHub access:
  ```bash
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  cat ~/.ssh/id_rsa.pub
  # Add this to GitHub → Settings → SSH and GPG keys
  ```

### Environment variables not found
- Ensure `.env` file exists in the project directory on your server
- Check file permissions: `chmod 600 .env`

## Alternative: Using Docker (Optional)

If you prefer Docker, I can help you set up a Docker-based deployment instead!
