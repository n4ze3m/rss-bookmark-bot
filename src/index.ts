// configuring env
import "dotenv/config";
//  this will keep our bot from sleeping inside free plan hosting
import "./keep_alive";
// importing other required modules
import TelegramBot from "node-telegram-bot-api";
import { telegramUserName } from "./utils/name";
// the main function for the bot
const main = async () => {
    console.log("---BOT STARTED---")
    const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
    // the bot will listen for the following commands
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        // the bot will send a message to the user with the following html markup
        const message = `<b>Hey ${telegramUserName(msg)}👋</b>, Nice to meet you. I'm RSS bookmark bot. I can help you to keep track of your favorite RSS feeds.\n\n<b>How to use me?</b>\n\n<b>/config <i> rss-url </i> </b> - to add a new RSS feed\n<b>/list</b> - to list all your RSS feeds\n<b>/help</b> - to get this message again`;
        // sending the message
        bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    });
}

main()