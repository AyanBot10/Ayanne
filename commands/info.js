const os = require('os');
const { exec } = require('child_process');

module.exports = {
  name: 'info',
  description: 'Show developer information and bot stats.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;

    // Developer and bot information
    const developerName = 'Your Developer Name';
    const botName = 'Your Bot Name';
    const description = `*🤖 Bot Information:*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Bot Name:* ${botName}\n` +
      `*Developer:* ${developerName}\n` +
      `*Description:* A multifunctional bot with a range of utilities and features.\n\n` +
      '*🌐 Developer Links:*\n' +
      '━━━━━━━━━━━━━━━━━━━━━\n' +
      `[GitHub](https://github.com/yourgithub) | [YouTube](https://youtube.com/yourchannel) | [Instagram](https://instagram.com/yourinstagram) | [Facebook](https://facebook.com/yourfacebook)\n\n`;

    // Bot status details
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const freeRam = (os.freemem() / 1024 / 1024).toFixed(2);
    const cpuUsage = os.loadavg()[0].toFixed(2);

    let storageInfo = 'N/A';
    exec('df -h /', (error, stdout) => {
      if (!error) {
        storageInfo = stdout.split('\n')[1].split(/\s+/);
      }

      const statusMessage = `${description}\n` +
        '*📊 Bot Status:*\n' +
        '━━━━━━━━━━━━━━━━━━━━━\n' +
        `*• RAM Usage:* ${ramUsage} MB / ${totalRam} MB (Free: ${freeRam} MB)\n` +
        `*• CPU Load:* ${cpuUsage}\n` +
        `*• Storage:* ${storageInfo[2]} used / ${storageInfo[1]} total\n\n` +
        '━━━━━━━━━━━━━━━━━━━━━\n' +
        '*Connect with us on social media!*\n\n';

      // Inline buttons for social media links
      const buttons = {
        inline_keyboard: [
          [
            { text: 'GitHub', url: 'https://github.com/yourgithub' },
            { text: 'YouTube', url: 'https://youtube.com/yourchannel' },
          ],
          [
            { text: 'Instagram', url: 'https://instagram.com/yourinstagram' },
            { text: 'Facebook', url: 'https://facebook.com/yourfacebook' },
          ],
        ],
      };

      bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown', reply_markup: buttons });
    });
  }
};
