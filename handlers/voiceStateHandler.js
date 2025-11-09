const { JOIN_MESSAGES, NOTIFICATION_CHANNEL_NAME } = require('../config/constants');

const recentJoins = new Map();

/**
 * Handles voice state updates (user joining/leaving voice channels)
 */
async function handleVoiceStateUpdate(oldState, newState) {
  const member = newState.member;

  // Check if user joined a voice channel (wasn't in one before, now is)
  if (!oldState.channelId && newState.channelId) {
    const joinKey = `${member.id}-${newState.channelId}`;
    const now = Date.now();
    const lastJoinTime = recentJoins.get(joinKey);

    // Prevent duplicate notifications within 3 seconds
    if (lastJoinTime && now - lastJoinTime < 3000) {
      console.log(`⏭️  Skipping duplicate join event for ${member.user.tag}`);
      return;
    }

    recentJoins.set(joinKey, now);

    // Clean up after 3 seconds
    setTimeout(() => {
      recentJoins.delete(joinKey);
    }, 3000);

    console.log(
      `${member.user.tag} joined voice channel: ${newState.channel.name}`,
    );

    await sendJoinNotification(member, newState.channel, newState.guild);
  }
}

/**
 * Sends a notification when a user joins a voice channel
 */
async function sendJoinNotification(member, voiceChannel, guild) {
  const randomMessage = JOIN_MESSAGES[Math.floor(Math.random() * JOIN_MESSAGES.length)];
  const formattedMessage = randomMessage
    .replace("{user}", `<@${member.id}>`)
    .replace("{channel}", voiceChannel.name);

  try {
    // Try to send message directly to voice channel
    await voiceChannel.send(formattedMessage);
    console.log(`✅ Notification sent to voice channel: ${voiceChannel.name}`);
  } catch (error) {
    console.error(`❌ Failed to send to voice channel chat: ${error.message}`);
    console.log(`Attempting to send to fallback text channel...`);

    // Fallback to text channel if voice channel message fails
    await sendToFallbackChannel(guild, formattedMessage);
  }
}

/**
 * Sends notification to fallback text channel
 */
async function sendToFallbackChannel(guild, message) {
  const fallbackChannel = guild.channels.cache.find(
    (channel) =>
      channel.name === NOTIFICATION_CHANNEL_NAME && channel.isTextBased(),
  );

  if (fallbackChannel) {
    try {
      await fallbackChannel.send(message);
      console.log(`✅ Notification sent to fallback: ${fallbackChannel.name}`);
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed: ${fallbackError.message}`);
    }
  }
}

module.exports = { handleVoiceStateUpdate };
