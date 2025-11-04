const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

const NOTIFICATION_CHANNEL_NAME = 'general';
const recentJoins = new Map();

const JOIN_MESSAGES = [
  "🎉 {user} just slid into **{channel}**! Welcome!",
  "🔊 Look who decided to show up! {user} is now in **{channel}**!",
  "🎊 {user} has entered the building! Now vibing in **{channel}**!",
  "🌟 Everyone say hi to {user} who just joined **{channel}**!",
  "🎮 {user} joined **{channel}** - let the party begin!",
  "👋 {user} is now chilling in **{channel}**!",
  "🚀 Boom! {user} just landed in **{channel}**!",
  "🎪 The circus is complete! {user} joined **{channel}**!",
  "🎵 {user} walked into **{channel}** like they own the place!",
  "⭐ A wild {user} appeared in **{channel}**!",
  "🎯 {user} locked in and joined **{channel}**!",
  "🔥 Things just got hotter! {user} is in **{channel}**!",
  "💫 {user} blessed **{channel}** with their presence!",
  "🎈 Pop! {user} just popped into **{channel}**!",
  "🌈 {user} brought the good vibes to **{channel}**!",
  "🎤 {user} has entered **{channel}** - mic check 1, 2!",
  "🏆 Champion {user} joined **{channel}**!",
  "👑 Royalty alert! {user} is now in **{channel}**!",
  "🎨 {user} just painted themselves into **{channel}**!",
  "🌊 Making waves! {user} joined **{channel}**!",
  "⚡ {user} struck like lightning into **{channel}**!",
  "🎭 The show begins! {user} is in **{channel}**!",
  "🌙 {user} graced **{channel}** with their presence!",
  "🎺 Trumpet sounds! {user} has arrived at **{channel}**!",
  "🍕 Fresh delivery! {user} just joined **{channel}**!",
  "🎸 {user} is ready to rock in **{channel}**!",
  "🦄 A magical {user} appeared in **{channel}**!",
  "🌺 {user} bloomed into **{channel}**!",
  "🎃 Spooky! {user} haunted **{channel}**!",
  "🏴‍☠️ Ahoy! {user} sailed into **{channel}**!",
  "🎀 {user} wrapped themselves into **{channel}**!",
  "🌸 {user} just spawned in **{channel}**!",
  "💎 Rare sighting! {user} joined **{channel}**!",
  "🎆 Fireworks! {user} is now in **{channel}**!",
  "🔔 Ding ding! {user} joined **{channel}**!",
  "🌟 {user} just unlocked **{channel}**!",
  "🎲 {user} rolled into **{channel}**!",
  "🍀 Lucky us! {user} joined **{channel}**!",
  "🎬 Action! {user} is live in **{channel}**!",
  "🌻 {user} brightened up **{channel}**!",
  "🎪 Ladies and gentlemen, {user} is in **{channel}**!",
  "🚁 {user} just choppered into **{channel}**!",
  "🎢 {user} is riding the wave in **{channel}**!",
  "🎡 Round and round! {user} joined **{channel}**!",
  "🌍 {user} traveled across the world to **{channel}**!",
  "🎓 Professor {user} has joined **{channel}**!",
  "🔮 The prophecy was true! {user} is in **{channel}**!",
  "🌪️ {user} whirlwinded into **{channel}**!",
  "🎹 {user} is composing vibes in **{channel}**!",
  "🏖️ {user} brought vacation energy to **{channel}**!"
];

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(`Monitoring voice channels in ${readyClient.guilds.cache.size} server(s)`);
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
    
    console.log(`${member.user.tag} joined voice channel: ${newState.channel.name}`);
    
    const guild = newState.guild;
    const notificationChannel = guild.channels.cache.find(
      channel => channel.name === NOTIFICATION_CHANNEL_NAME && channel.isTextBased()
    );
    
    if (notificationChannel) {
      try {
        const randomMessage = JOIN_MESSAGES[Math.floor(Math.random() * JOIN_MESSAGES.length)];
        const formattedMessage = randomMessage
          .replace('{user}', `<@${member.id}>`)
          .replace('{channel}', newState.channel.name);
        
        await notificationChannel.send(formattedMessage);
        console.log(`✅ Notification sent to #${NOTIFICATION_CHANNEL_NAME}`);
      } catch (error) {
        console.error(`❌ Failed to send notification: ${error.message}`);
      }
    } else {
      console.warn(`⚠️  Notification channel "${NOTIFICATION_CHANNEL_NAME}" not found in ${guild.name}`);
    }
  }
});

client.on(Events.Error, (error) => {
  console.error('❌ Discord client error:', error);
});

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('❌ Error: DISCORD_BOT_TOKEN is not set in environment variables');
  console.log('Please set your Discord bot token in the Secrets panel');
  process.exit(1);
}

client.login(DISCORD_TOKEN).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  process.exit(1);
});
