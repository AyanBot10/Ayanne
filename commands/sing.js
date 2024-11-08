const axios = require('axios');

module.exports = {
  name: 'sing',
  adminOnly: false,
  ownerOnly: false,
  category: 'Entertainment',
  description: 'Get audio or video of a song',
  guide: 'Use /sing <song name> for audio, or /sing video <song name> for video',
  execute: async (bot, msg, args) => {
    const chatId = msg.chat.id;

    if (args.length === 0) {
      return bot.sendMessage(chatId, 'Please provide a song name. Usage: /sing <song name> or /sing video <song name>');
    }

    let isVideo = false;
    let query;

    if (args[0].toLowerCase() === 'video') {
      isVideo = true;
      query = args.slice(1).join(' ');
      if (!query) {
        return bot.sendMessage(chatId, 'Please provide a song name after "video". Usage: /sing video <song name>');
      }
    } else {
      query = args.join(' ');
    }

    const apiUrl = `https://api.nexalo.xyz/ytv1.php?name=${encodeURIComponent(query)}&api=na_Z21SSP93HR0123QO`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data.status === 'success') {
        const { title, best_audio, best_video } = response.data;

        if (isVideo) {
          if (best_video && best_video.video_link) {
            await sendVideoToTelegram(bot, chatId, best_video.video_link, title, best_video.quality);
          } else {
            await bot.sendMessage(chatId, "Sorry, I couldn't find a video for this song.");
          }
        } else {
          if (best_audio && best_audio.audio_link) {
            await sendAudioToTelegram(bot, chatId, best_audio.audio_link, title, best_audio.quality);
          } else {
            await bot.sendMessage(chatId, "Sorry, I couldn't find audio for this song.");
          }
        }
      } else {
        await bot.sendMessage(chatId, "I'm sorry, I couldn't find the requested song. Please try a different query.");
      }
    } catch (error) {
      console.error('Error in sing command:', error);
      await bot.sendMessage(chatId, "Oops! Something went wrong while fetching the song. Please try again later.");
    }
  }
};

async function sendVideoToTelegram(bot, chatId, videoUrl, title, quality) {
  try {
    const videoStream = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'Content-Type': 'video/mp4'  // Explicitly setting content-type for video
      }
    });

    await bot.sendVideo(chatId, videoStream.data, {
      caption: `🎥 ${title}\n\nQuality: ${quality}`
    });
  } catch (error) {
    console.error('Error sending video:', error);
    await bot.sendMessage(chatId, "Sorry, I couldn't send the video. It might be too large or in an unsupported format.");
  }
}

async function sendAudioToTelegram(bot, chatId, audioUrl, title, quality) {
  try {
    const audioStream = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'Content-Type': 'audio/mpeg'  // Explicitly setting content-type for audio
      }
    });

    await bot.sendAudio(chatId, audioStream.data, {
      title: title,
      performer: 'Requested Song',
      caption: `🎵 ${title}\n\nQuality: ${quality}`
    });
  } catch (error) {
    console.error('Error sending audio:', error);
    await bot.sendMessage(chatId, "Sorry, I couldn't send the audio. It might be too large or in an unsupported format.");
  }
}
