const fetch = require('node-fetch');

async function execute(bot, msg, groupName, memberCount) {
  const chatId = msg.chat.id;
  const newMember = msg.new_chat_member;
  const username = newMember.username || newMember.first_name || 'New member';
  const userId = newMember.id;

  try {
    // Fetch the welcome image from the API
    const apiUrl = `https://api.nexalo.xyz/welcome_v2?api=na_T51VHMGBMZJO7S2B&name=${encodeURIComponent(username)}&text=${encodeURIComponent(`Welcome to ${groupName}`)}`;
    const response = await fetch(apiUrl);
    const imageBuffer = await response.buffer();

    // Create a mention of the user
    const userMention = `<a href="tg://user?id=${userId}">${username}</a>`;

    // Send the welcome message with the image and user mention
    await bot.sendPhoto(chatId, imageBuffer, {
      caption: `Welcome to ${groupName}, ${userMention}! 🎉\nYou're our ${memberCount}th member! 🌟\n\nWe're excited to have you join us. Feel free to introduce yourself and join the conversation!`,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error in welcome event:', error);
    // Send a text-only welcome message as fallback, still with user mention
    const userMention = `<a href="tg://user?id=${userId}">${username}</a>`;
    await bot.sendMessage(chatId, `Welcome to ${groupName}, ${userMention}! 🎉\nYou're our ${memberCount}th member! 🌟\n\nWe're excited to have you join us. Feel free to introduce yourself and join the conversation!`, {
      parse_mode: 'HTML'
    });
  }
}

module.exports = {
  name: 'welcome',
  execute
};