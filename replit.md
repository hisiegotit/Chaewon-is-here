# Discord Voice Channel Notifier Bot

## Overview
A Discord bot built with discord.js that automatically sends notification messages whenever someone joins a voice channel. The bot monitors voice state changes in real-time and posts updates to a designated text channel.

## Current State
- ✅ Project initialized with Node.js 20
- ✅ discord.js v14 installed
- ✅ Bot code implemented with voice channel monitoring
- ⏳ Awaiting Discord bot token configuration

## Recent Changes
- **2025-11-04**: Initial project setup
  - Created Discord bot with voiceStateUpdate event handling
  - Configured to send notifications to "general" text channel
  - Added error handling and logging
  - Created README with setup instructions

## Project Architecture
```
discord-voice-notifier/
├── index.js           # Main bot code with voice monitoring logic
├── package.json       # Node.js dependencies (discord.js)
├── .env.example       # Example environment variables
├── README.md          # Setup and usage instructions
└── .gitignore        # Excludes node_modules and secrets
```

## Key Features
- Voice channel join detection using Discord Gateway
- Automatic notifications to text channel
- Configurable notification channel name
- Error handling and console logging
- Uses environment variables for secure token storage

## Configuration
- **Notification Channel**: Set via `NOTIFICATION_CHANNEL_NAME` constant (default: "general")
- **Bot Token**: Must be set as `DISCORD_BOT_TOKEN` in Replit Secrets

## Dependencies
- discord.js ^14.14.1
- Node.js 20

## User Preferences
- Not yet specified
