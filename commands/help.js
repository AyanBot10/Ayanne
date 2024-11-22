const { MessageEntity } = require('node-telegram-bot-api');

module.exports = {
  name: 'help',
  adminOnly: false,
  ownerOnly: false,
  category: 'Utility',
  description: 'Show all available commands',
  guide: 'Use /help to see all commands',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const commands = bot.commands;

    if (!commands) {
      return bot.sendMessage(chatId, 'Error: Commands not available. Please try again later.');
    }

    const createCommandList = (cmds) => {
      const categories = {};
      Object.entries(cmds).forEach(([name, cmd]) => {
        if (!categories[cmd.category]) {
          categories[cmd.category] = [];
        }
        categories[cmd.category].push(name);
      });

      let commandList = '';
      for (const [category, cmds] of Object.entries(categories)) {
        commandList += `╭───✿ ${category}\n`;
        for (let i = 0; i < cmds.length; i += 2) {
          commandList += `│♡${cmds[i]}${cmds[i+1] ? ` ♡${cmds[i+1]}` : ''}\n`;
        }
        commandList += `╰───────────✿\n`;
      }
      return commandList;
    };

    const getBotInfo = async () => {
      try {
        const botInfo = await bot.getMe();
        const ownerId = process.env.OWNER_ID;
        let ownerName = 'Unknown';

        if (ownerId) {
          try {
            const chatMember = await bot.getChatMember(ownerId, ownerId);
            ownerName = chatMember.user.first_name || 'Unknown';
          } catch (error) {
            console.error('Error fetching owner info:', error);
          }
        }

        return `Nexalo ♡\nMy sensei\n${ownerName}\nfb.com/hridoy.py`;
      } catch (error) {
        console.error('Error fetching bot info:', error);
        return 'Unable to fetch bot and owner information.';
      }
    };

    try {
      const commandList = createCommandList(commands);
      const botInfo = await getBotInfo();
      const totalCommands = Object.keys(commands).length;

      const finalMessage = `${commandList}
╭───✿ SUPPORT GC
│If you don't know how to
│use Nexalo or face any
│problem then please join
│Nino ♡ Nexalo Support gc by click the below button 
├──────────✿
├─────✿
│» Total Cmds ${totalCommands} cmds.
│» Type /help <cmd> to learn
│how to use the command.
├─────✿
│ ${botInfo}
╰─────────────✿`;

      const keyboard = {
        inline_keyboard: [
          [{ text: 'Join Support Group', url: 'https://t.me/example_support_group' }]
        ]
      };

      await bot.sendMessage(chatId, finalMessage, { 
        parse_mode: 'Markdown',
        reply_markup: JSON.stringify(keyboard)
      });
    } catch (error) {
      console.error('Error in help command:', error);
      await bot.sendMessage(chatId, 'An error occurred while fetching the help information. Please try again later.');
    }
  }
};

