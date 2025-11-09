/**
 * Registers all slash commands for the Discord bot
 */
async function registerCommands(client) {
  try {
    const rspCommand = {
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

    await client.application.commands.create(rspCommand);
    console.log("✅ Registered /rsp command");
  } catch (err) {
    console.error("❌ Failed to register /rsp command:", err);
  }
}

module.exports = { registerCommands };
