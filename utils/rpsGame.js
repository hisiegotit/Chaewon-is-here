const CHOICES = ["rock", "paper", "scissors"];

const EMOJI_MAP = {
  rock: "🪨 Rock",
  paper: "📄 Paper",
  scissors: "✂️ Scissors",
};

const WIN_CONDITIONS = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

/**
 * Plays rock-paper-scissors game
 * @param {string} userChoice - User's choice (rock, paper, or scissors)
 * @returns {object} Game result with userChoice, botChoice, result message, and formatted text
 */
function playRockPaperScissors(userChoice) {
  const botChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];

  const result =
    userChoice === botChoice ? "It's a tie! 🤝" :
    WIN_CONDITIONS[userChoice] === botChoice ? "You win! 🎉" :
    "You lose! 😢";

  return {
    userChoice,
    botChoice,
    result,
    formatted: `You chose: ${EMOJI_MAP[userChoice]}\nI chose: ${EMOJI_MAP[botChoice]}\n\n${result}`,
  };
}

module.exports = { playRockPaperScissors, EMOJI_MAP, CHOICES };
