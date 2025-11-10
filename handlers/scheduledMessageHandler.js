const { GOOD_MORNING_MESSAGES, GOOD_NIGHT_MESSAGES, SCHEDULED_CHANNEL_ID } = require('../config/constants');

/**
 * Sets up scheduled messages for good morning and good night
 * Good morning: 7:00 AM GMT+7
 * Good night: 11:00 PM GMT+7
 */
function setupScheduledMessages(client) {
  // Check and send messages every minute
  setInterval(() => {
    checkAndSendScheduledMessage(client);
  }, 60000); // Check every minute

  // Also check immediately on startup
  setTimeout(() => {
    checkAndSendScheduledMessage(client);
  }, 5000); // Wait 5 seconds after bot starts

  console.log('✅ Scheduled messages initialized (7:00 AM & 11:00 PM GMT+7)');
}

/**
 * Checks current time and sends appropriate message if it's the right time
 */
async function checkAndSendScheduledMessage(client) {
  // Get current time in GMT+7 (Vietnam timezone)
  const now = new Date();
  const gmtPlus7Time = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  
  const hour = gmtPlus7Time.getHours();
  const minute = gmtPlus7Time.getMinutes();

  // Store last sent date to prevent duplicate messages
  if (!global.lastGoodMorning) global.lastGoodMorning = null;
  if (!global.lastGoodNight) global.lastGoodNight = null;

  const today = gmtPlus7Time.toDateString();

  // Good morning at 7:00 AM
  if (hour === 7 && minute === 0 && global.lastGoodMorning !== today) {
    await sendScheduledMessage(client, 'morning');
    global.lastGoodMorning = today;
    console.log('🌅 Good morning message sent!');
  }

  // Good night at 11:00 PM (23:00)
  if (hour === 23 && minute === 0 && global.lastGoodNight !== today) {
    await sendScheduledMessage(client, 'night');
    global.lastGoodNight = today;
    console.log('🌙 Good night message sent!');
  }
}

/**
 * Sends a scheduled message to all guilds
 */
async function sendScheduledMessage(client, type) {
  const messages = type === 'morning' ? GOOD_MORNING_MESSAGES : GOOD_NIGHT_MESSAGES;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // Send to all guilds the bot is in
  for (const guild of client.guilds.cache.values()) {
    try {
      const channel = guild.channels.cache.get(SCHEDULED_CHANNEL_ID);
      
      if (channel && channel.isTextBased()) {
        await channel.send(randomMessage);
        console.log(`✅ ${type === 'morning' ? 'Good morning' : 'Good night'} message sent to ${guild.name}`);
      } else {
        console.log(`⚠️  Channel ${SCHEDULED_CHANNEL_ID} not found in ${guild.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send scheduled message to ${guild.name}: ${error.message}`);
    }
  }
}

module.exports = { setupScheduledMessages };
