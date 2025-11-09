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

const JOIN_MESSAGES = [
  "🎃 Ô {user} làm gì trong **{channel}** đấyyyyy????!",
  "👀 Nè nè {user}, vào **{channel}** làm gì mà bí ẩn vậy?",
  "✨ Chào mừng {user} đã đột nhập **{channel}** — mission accepted?",
  "🔥 Báo động! {user} xuất hiện tại **{channel}**!",
  "🛸 {user} vừa hạ cánh ở **{channel}**, ai mang bánh kẹo?",
  "🎉 {user} đến rồi — mở confetti cho **{channel}**!",
  "😎 {user} vào **{channel}** — giờ mới có việc để làm!",
  "🍀 Chúc mừng {user} đã tìm thấy **{channel}** — treasure hunt tiếp thôi!",
  "⚡ {user} kích hoạt chế độ support tại **{channel}**!",
  "🤖 Alo {user}, bạn đang ở **{channel}** — thời gian debug bắt đầu!",
  "🐱‍👤 {user} stealth mode off — xuất hiện ở **{channel}**!",
  "🌪️ OMG {user} vừa quét qua **{channel}**, giũa tay đi!",
  "🥳 {user} đã nhảy vào **{channel}** — party time!",
  "🎭 {user} vào **{channel}** với trang phục tuyệt vời (ảo tưởng thôi)!",
  "📣 Attention! {user} joined **{channel}** — xin đặt câu hỏi nào?",
  "🍩 {user} vào **{channel}** — có đem donut không??",
  "🧭 {user} đã lạc vào **{channel}** — có ai hướng dẫn không?",
  "🏄 {user} surf vào **{channel}** — sóng êm hay bão tố?",
  "💡 Ý tưởng mới: {user} vào **{channel}** — note mọi thứ lại!",
  "🎈 {user} ghé thăm **{channel}** — ai đi chơi nàoooo?",
];

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  console.log(
    `Monitoring voice channels in ${readyClient.guilds.cache.size} server(s)`,
  );

  // Register /rsp slash command (global). It can take a while to appear globally.
  // For faster testing, register per-guild instead (requires guild id).
  try {
    const data = {
      name: "rsp",
      description: "Play rock-paper-scissors with the bot",
      options: [
        {
          name: "choice",
          type: 3, // STRING
          description: "Your choice",
          required: true,
          choices: [
            { name: "Rock 🪨", value: "rock" },
            { name: "Paper 📄", value: "paper" },
            { name: "Scissors ✂️", value: "scissors" },
          ],
        },
      ],
    };

    await readyClient.application.commands.create(data);
    console.log("✅ Registered /rsp command");
  } catch (err) {
    console.error("❌ Failed to register /rsp command:", err);
  }
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

    const voiceChannel = newState.channel;

    try {
      const randomMessage =
        JOIN_MESSAGES[Math.floor(Math.random() * JOIN_MESSAGES.length)];
      const formattedMessage = randomMessage
        .replace("{user}", `<@${member.id}>`)
        .replace("{channel}", voiceChannel.name);

      await voiceChannel.send(formattedMessage);
      console.log(
        `✅ Notification sent to voice channel: ${voiceChannel.name}`,
      );
    } catch (error) {
      console.error(
        `❌ Failed to send to voice channel chat: ${error.message}`,
      );
      console.log(`Attempting to send to fallback text channel...`);

      const guild = newState.guild;
      const fallbackChannel = guild.channels.cache.find(
        (channel) =>
          channel.name === NOTIFICATION_CHANNEL_NAME && channel.isTextBased(),
      );

      // Fallback to text channel if available
      if (fallbackChannel) {
        try {
          const randomMessage =
            JOIN_MESSAGES[Math.floor(Math.random() * JOIN_MESSAGES.length)];
          const formattedMessage = randomMessage
            .replace("{user}", `<@${member.id}>`)
            .replace("{channel}", voiceChannel.name);

          await fallbackChannel.send(formattedMessage);
          console.log(`✅ Notification sent to fallback: ${fallbackChannel.name}`);
        } catch (fallbackError) {
          console.error(`❌ Fallback also failed: ${fallbackError.message}`);
        }
      }
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "rsp") {
      const userChoice = interaction.options.getString("choice");
      const choices = ["rock", "paper", "scissors"];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];

      // Determine outcome
      let result;
      if (userChoice === botChoice) {
        result = "It's a tie! 🤝";
      } else if (
        (userChoice === "rock" && botChoice === "scissors") ||
        (userChoice === "paper" && botChoice === "rock") ||
        (userChoice === "scissors" && botChoice === "paper")
      ) {
        result = "You win! 🎉";
      } else {
        result = "You lose! 😢";
      }

      // Friendly emoji map
      const emojiMap = {
        rock: "🪨 Rock",
        paper: "📄 Paper",
        scissors: "✂️ Scissors",
      };

      await interaction.reply({
        content: `You chose: ${emojiMap[userChoice]}\nI chose: ${emojiMap[botChoice]}\n\n${result}`,
        allowedMentions: { parse: [] },
      });
    }
  } catch (err) {
    console.error("❌ Interaction handler error:", err);
    if (interaction && !interaction.replied) {
      await interaction.reply({
        content: "There was an error while executing that command.",
        ephemeral: true,
      });
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
