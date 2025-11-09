const { playRockPaperScissors } = require('../utils/rpsGame');

/**
 * Handles Discord interactions (slash commands, buttons, etc.)
 */
async function handleInteraction(interaction) {
  try {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "rsp") {
      await handleRockPaperScissorsCommand(interaction);
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
}

/**
 * Handles the /rsp (rock-paper-scissors) command
 */
async function handleRockPaperScissorsCommand(interaction) {
  const userChoice = interaction.options.getString("choice");
  const gameResult = playRockPaperScissors(userChoice);

  await interaction.reply({
    content: gameResult.formatted,
    allowedMentions: { parse: [] },
  });
}

module.exports = { handleInteraction };
