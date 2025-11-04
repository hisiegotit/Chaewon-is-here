# Discord Voice Channel Notifier Bot

A Discord bot that automatically sends notification messages to a text channel whenever someone joins a voice channel.

## Features

- 🔊 Detects when users join voice channels
- 🎲 Sends random fun messages from a pool of 50+ creative notifications
- 👤 Mentions/tags the user who joined
- 📢 Sends automatic notifications to a designated text channel
- 🛡️ Built with discord.js v14
- ⚡ Real-time monitoring using Discord Gateway
- 🚫 Prevents duplicate notifications with smart cooldown system

## Setup Instructions

### 1. Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - Server Members Intent
   - Message Content Intent (optional, for future features)
5. Click "Reset Token" to get your bot token
6. Copy the token (you'll need it for the next step)

### 2. Configure the Bot Token

1. In Replit, go to the "Secrets" panel (lock icon in sidebar)
2. Add a new secret:
   - Key: `DISCORD_BOT_TOKEN`
   - Value: (paste your bot token here)

### 3. Invite the Bot to Your Server

1. In Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select scopes:
   - `bot`
3. Select bot permissions:
   - Send Messages
   - Read Messages/View Channels
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### 4. Run the Bot

Click the "Run" button in Replit, and the bot will start monitoring voice channels!

## Configuration

By default, the bot sends notifications to a channel named `general`. To change this, edit the `NOTIFICATION_CHANNEL_NAME` constant in `index.js`.

## How It Works

The bot listens for the `voiceStateUpdate` event, which fires whenever a user's voice state changes. When a user joins a voice channel (transitions from no channel to a channel), the bot sends a message to the designated text channel.

## Troubleshooting

- **Bot doesn't respond**: Make sure the bot has proper permissions in your Discord server
- **No notifications**: Verify that a text channel named "general" exists, or update the channel name in the code
- **Login error**: Double-check that your `DISCORD_BOT_TOKEN` is set correctly in Secrets
