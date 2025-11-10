require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { registerCommands } = require('./commands/registerCommands');
const { handleVoiceStateUpdate } = require('./handlers/voiceStateHandler');
const { handleInteraction } = require('./handlers/interactionHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(
    `Monitoring voice channels in ${readyClient.guilds.cache.size} server(s)`,
  );

  // Register slash commands
  await registerCommands(readyClient);
});

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

client.on(Events.InteractionCreate, handleInteraction);

client.on(Events.Error, (error) => {
	console.log('test');
	console.error("❌ Discord client error:", error);
});

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_TOKEN) {
  console.error(
    "❌ Error: DISCORD_BOT_TOKEN is not set in environment variables",
  );
  console.log("Please set your Discord bot token in the Secrets panel");
  process.exit(1);
}

client.login(DISCORD_TOKEN).catch((error) => {
  console.error("❌ Failed to login to Discord:", error.message);
  process.exit(1);
});
