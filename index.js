const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

const NOTIFICATION_CHANNEL_NAME = "general";
const recentJoins = new Map();

const JOIN_MESSAGES = ["🎃 Ô {user} làm gì trong ***{channel}*** đấyyyyy????!"];

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(
    `Monitoring voice channels in ${readyClient.guilds.cache.size} server(s)`,
  );
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  const member = newState.member;

  if (!oldState.channelId && newState.channelId) {
    const joinKey = `${member.id}-${newState.channelId}`;
    const now = Date.now();
    const lastJoinTime = recentJoins.get(joinKey);

    if (lastJoinTime && now - lastJoinTime < 3000) {
      console.log(`⏭️  Skipping duplicate join event for ${member.user.tag}`);
      return;
    }

    recentJoins.set(joinKey, now);

    setTimeout(() => {
      recentJoins.delete(joinKey);
    }, 3000);

    console.log(
      `${member.user.tag} joined voice channel: ${newState.channel.name}`,
    );

    const guild = newState.guild;
    let notificationChannel = null;

    try {
      const threads = await guild.channels.fetchActiveThreads();
      const voiceThread = threads.threads.find(
        (thread) => thread.parentId === newState.channelId,
      );

      if (voiceThread) {
        notificationChannel = voiceThread;
        console.log(`Found thread for voice channel: ${voiceThread.name}`);
      }
    } catch (error) {
      console.error(`Error fetching threads: ${error.message}`);
    }

    if (!notificationChannel) {
      const voiceChannelName = newState.channel.name.toLowerCase();
      notificationChannel = guild.channels.cache.find(
        (channel) =>
          channel.name.toLowerCase() === voiceChannelName &&
          channel.isTextBased(),
      );
    }

    if (!notificationChannel) {
      notificationChannel = guild.channels.cache.find(
        (channel) =>
          channel.name === NOTIFICATION_CHANNEL_NAME && channel.isTextBased(),
      );
    }

    if (notificationChannel) {
      try {
        const randomMessage =
          JOIN_MESSAGES[Math.floor(Math.random() * JOIN_MESSAGES.length)];
        const formattedMessage = randomMessage
          .replace("{user}", `<@${member.id}>`)
          .replace("{channel}", newState.channel.name);

        await notificationChannel.send(formattedMessage);
        console.log(`✅ Notification sent to ${notificationChannel.name}`);
      } catch (error) {
        console.error(`❌ Failed to send notification: ${error.message}`);
      }
    } else {
      console.warn(
        `⚠️  No notification channel found for voice channel "${newState.channel.name}"`,
      );
    }
  }
});

client.on(Events.Error, (error) => {
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
