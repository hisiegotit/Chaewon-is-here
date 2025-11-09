#!/bin/bash

# Server Setup Script for Chaewon Discord Bot
# Run this script on your server to prepare it for auto-deployment

set -e  # Exit on error

echo "=========================================="
echo "Chaewon Bot Server Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use: sudo bash setup-server.sh)${NC}"
    exit 1
fi

echo ""
echo "Step 1: Installing Node.js and npm..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}Node.js is already installed: $(node --version)${NC}"
else
    echo "Installing Node.js 20.x LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}Node.js installed: $(node --version)${NC}"
fi

echo ""
echo "Step 2: Installing PM2..."
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}PM2 is already installed: $(pm2 --version)${NC}"
else
    npm install -g pm2
    echo -e "${GREEN}PM2 installed: $(pm2 --version)${NC}"
fi

echo ""
echo "Step 3: Installing Git..."
if command -v git &> /dev/null; then
    echo -e "${GREEN}Git is already installed: $(git --version)${NC}"
else
    apt-get install -y git
    echo -e "${GREEN}Git installed: $(git --version)${NC}"
fi

echo ""
echo "Step 4: Cloning repository..."
cd ~
PROJECT_DIR="$HOME/Chaewon-is-here"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}Project directory already exists at: $PROJECT_DIR${NC}"
    read -p "Do you want to remove it and re-clone? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
        git clone https://github.com/hisiegotit/Chaewon-is-here.git
        echo -e "${GREEN}Repository cloned!${NC}"
    fi
else
    git clone https://github.com/hisiegotit/Chaewon-is-here.git
    echo -e "${GREEN}Repository cloned!${NC}"
fi

echo ""
echo "Step 5: Setting up project..."
cd "$PROJECT_DIR"
npm install
echo -e "${GREEN}Dependencies installed!${NC}"

echo ""
echo "Step 6: Setting up environment variables..."
if [ -f ".env" ]; then
    echo -e "${YELLOW}.env file already exists${NC}"
    cat .env
    read -p "Do you want to edit it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        nano .env
    fi
else
    echo "Creating .env file..."
    read -p "Enter your Discord Bot Token: " BOT_TOKEN
    echo "DISCORD_BOT_TOKEN=$BOT_TOKEN" > .env
    chmod 600 .env
    echo -e "${GREEN}.env file created!${NC}"
fi

echo ""
echo "Step 7: Starting bot with PM2..."
pm2 delete chaewon-bot 2>/dev/null || true
pm2 start index.js --name chaewon-bot
pm2 save
pm2 startup | tail -n 1 > /tmp/pm2-startup.sh
chmod +x /tmp/pm2-startup.sh
bash /tmp/pm2-startup.sh

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Your bot is now running!"
echo ""
echo "Project location: $PROJECT_DIR"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check bot status"
echo "  pm2 logs chaewon-bot - View bot logs"
echo "  pm2 restart chaewon-bot - Restart bot"
echo ""
echo "Next steps:"
echo "1. Add this to GitHub Secrets:"
echo "   PROJECT_PATH = $PROJECT_DIR"
echo ""
echo "2. Test deployment by pushing to master branch"
echo ""
