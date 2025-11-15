// Presence handler: logs presence changes but does not send messages
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
  }
}

module.exports = { handlePresenceUpdate };
