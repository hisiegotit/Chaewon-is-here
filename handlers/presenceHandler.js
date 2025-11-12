const { ONLINE_MESSAGES, OFFLINE_MESSAGES, NOTIFICATION_CHANNEL_NAME } = require('../config/constants');

const recentOnlineNotifications = new Map();
const recentOfflineNotifications = new Map();

/**
 * Handles presence updates (user status changes like offline to online)
 */
async function handlePresenceUpdate(oldPresence, newPresence) {
  // Skip if it's a bot
  if (newPresence.user?.bot) {
    return;
  }

  const member = newPresence.member;
  const guild = newPresence.guild;

  // Get old and new status
  const oldStatus = oldPresence?.status || 'offline';
  const newStatus = newPresence.status;

  // Check if user went from offline to online (any online status)
  if (oldStatus === 'offline' && (newStatus === 'online' || newStatus === 'idle' || newStatus === 'dnd')) {
    const notificationKey = `${member.id}`;
    const now = Date.now();
    const lastNotificationTime = recentOnlineNotifications.get(notificationKey);

    // Prevent duplicate notifications within 30 seconds
    if (lastNotificationTime && now - lastNotificationTime < 30000) {
      console.log(`⏭️  Skipping duplicate online notification for ${member.user.tag}`);
      return;
    }

    recentOnlineNotifications.set(notificationKey, now);

    // Clean up after 30 seconds
    setTimeout(() => {
      recentOnlineNotifications.delete(notificationKey);
    }, 30000);

    console.log(`🟢 ${member.user.tag} went online (${oldStatus} -> ${newStatus})`);

    await sendOnlineNotification(member, guild);
  }

  // Check if user went from any online status to offline
  if ((oldStatus === 'online' || oldStatus === 'idle' || oldStatus === 'dnd') && newStatus === 'offline') {
    const notificationKey = `${member.id}`;
    const now = Date.now();
    const lastNotificationTime = recentOfflineNotifications.get(notificationKey);

    // Prevent duplicate notifications within 30 seconds
    if (lastNotificationTime && now - lastNotificationTime < 30000) {
      console.log(`⏭️  Skipping duplicate offline notification for ${member.user.tag}`);
      return;
    }

    recentOfflineNotifications.set(notificationKey, now);

    // Clean up after 30 seconds
    setTimeout(() => {
      recentOfflineNotifications.delete(notificationKey);
    }, 30000);

    console.log(`⚫ ${member.user.tag} went offline (${oldStatus} -> ${newStatus})`);

    await sendOfflineNotification(member, guild);
  }
}

/**
 * Sends a notification when a user comes online
 */
async function sendOnlineNotification(member, guild) {
  const randomMessage = ONLINE_MESSAGES[Math.floor(Math.random() * ONLINE_MESSAGES.length)];
  const formattedMessage = randomMessage.replace("{user}", `<@${member.id}>`);

  try {
    // Send to specific channel ID
    const targetChannelId = '1425436238525239317';
    const channel = guild.channels.cache.get(targetChannelId);

    if (channel) {
      await channel.send(formattedMessage);
      console.log(`✅ Online notification sent to #${channel.name}`);
    } else {
      console.error(`❌ Could not find channel with ID ${targetChannelId}`);
      
      // Try to find the general channel as fallback
      const fallbackChannel = guild.channels.cache.find(
        ch => ch.name === NOTIFICATION_CHANNEL_NAME && ch.isTextBased()
      );
      if (fallbackChannel) {
        await fallbackChannel.send(formattedMessage);
        console.log(`✅ Online notification sent to fallback channel #${fallbackChannel.name}`);
      } else {
        console.error(`❌ No suitable channel found to send online notification`);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to send online notification: ${error.message}`);
  }
}

/**
 * Sends a notification when a user goes offline
 */
async function sendOfflineNotification(member, guild) {
  const randomMessage = OFFLINE_MESSAGES[Math.floor(Math.random() * OFFLINE_MESSAGES.length)];
  const formattedMessage = randomMessage.replace("{user}", `<@${member.id}>`);

  try {
    // Send to specific channel ID
    const targetChannelId = '1425436238525239317';
    const channel = guild.channels.cache.get(targetChannelId);

    if (channel) {
      await channel.send(formattedMessage);
      console.log(`✅ Offline notification sent to #${channel.name}`);
    } else {
      console.error(`❌ Could not find channel with ID ${targetChannelId}`);
      
      // Try to find the general channel as fallback
      const fallbackChannel = guild.channels.cache.find(
        ch => ch.name === NOTIFICATION_CHANNEL_NAME && ch.isTextBased()
      );
      if (fallbackChannel) {
        await fallbackChannel.send(formattedMessage);
        console.log(`✅ Offline notification sent to fallback channel #${fallbackChannel.name}`);
      } else {
        console.error(`❌ No suitable channel found to send offline notification`);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to send offline notification: ${error.message}`);
  }
}

module.exports = { handlePresenceUpdate };
