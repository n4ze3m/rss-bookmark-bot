// configuring env
import "dotenv/config";
//  this will keep our bot from sleeping inside free plan hosting
import "./keep_alive";
// importing other required modules
import TelegramBot from "node-telegram-bot-api";
import { telegramUserName } from "./utils/name";
import text from "./utils/text";
import mongoose from "mongoose";
import { configRssUrl } from "./controllers/config_controller";
import { getRSSFeed, getUserBookmarks } from "./controllers/list_controller";
import { chooseRssToDelete, removeRss } from "./controllers/remove_controller";
// the main function for the bot
const main = async () => {
    // connecting to the database
    mongoose.connect(process.env.MONGODB_URI!, {}).then(async () => {
        console.log("---DB CONNECTED---")
        console.log("---BOT STARTED---")
        // creating the bot
        const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
        // the bot will listen for the following commands
        // /start - to start the bot
        bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            // the bot will send a message to the user with the following html markup
            const message = `<b>Hey ${telegramUserName(msg)}👋</b>, Nice to meet you. I'm RSS bookmark bot. I can help you to keep track of your favorite RSS feeds.\n\n${text["help"]}`;
            // sending the message
            bot.sendMessage(chatId, message, { parse_mode: "HTML" });
        });
        // /help - to get the help message
        bot.onText(/\/help/, async (msg) => {
            const chatId = msg.chat.id;
            // the bot will send a message to the user with the following html markup
            const message = `${text["help"]}`;
            // sending the message
            bot.sendMessage(chatId, message, { parse_mode: "HTML" });
        });
        // /config <url> - to add a new RSS feed
        bot.onText(/\/config (.+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            if (!match) {
                return;
            }
            const url = match[1];
            // check url is valid
            if (!url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
                // the bot will send a message to the user with the following html markup
                const message = `Please enter a valid url 😅 ?`;
                // sending the message
                bot.sendMessage(chatId, message, { parse_mode: "HTML" });
                return;
            }

            const { message, error, keyboard } = await configRssUrl(msg.from?.id.toString()!, url);
            if (error) {
                bot.sendMessage(chatId, message, { parse_mode: "HTML" });
                return;
            } else {
                // const inline_keyboard = keyboard
                bot.sendMessage(chatId, message, { parse_mode: "HTML", reply_markup: { keyboard } });
            }
        });
        // /list - to list all your RSS feeds
        bot.onText(/\/list/, async (msg) => {
            const chatId = msg.chat.id;
            // check if the user already exists


            // the bot will send a message to the user with the following html markup
            const { message, error, keyboard } = await getUserBookmarks(msg.from?.id.toString()!);
            if (!error) {
                bot.sendMessage(chatId, message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard
                    }
                });
            } else {
                bot.sendMessage(chatId, message, { parse_mode: "HTML" });
            }
        });
        // /view <string> - to view data from configured domain
        bot.onText(/\/view (.+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            if (!match) {
                return;
            }
            const text = match[1];

            const message = await getRSSFeed(msg.from?.id.toString()!, text);

            // check url is valid
            bot.sendMessage(chatId, message, { parse_mode: "HTML", disable_web_page_preview: true });
        });
        // /remove - to delete a RSS feed
        bot.onText(/\/remove/, async (msg) => {
            const chatId = msg.chat.id;
            // the bot will send a message to the user with the following html markup
            const { message, error, keyboard: inline_keyboard } = await chooseRssToDelete(msg.from?.id.toString()!);

            if (!error) {
                bot.sendMessage(chatId, message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard
                    }
                });
            } else {
                // sending the message
                bot.sendMessage(chatId, message, { parse_mode: "HTML" });
            }
        })
        // this will be for callback
        bot.on('callback_query', async (msg) => {
            bot.answerCallbackQuery(msg.id);
            // delete code
            const { message, error, keyboard } = await removeRss(msg.from?.id.toString()!, msg.data!);
            if (!error) {
                bot.editMessageText(message, {
                    chat_id: msg!.message!.chat.id!,
                    message_id: msg!.message!.message_id!,
                    parse_mode: "HTML",
                })
                bot.sendMessage(msg.message!.chat.id!, "Keyboard updated!", {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard
                    }
                })
            } else {
                bot.editMessageText(message, {
                    chat_id: msg!.message!.chat.id!,
                    message_id: msg!.message!.message_id!,
                    parse_mode: "HTML",
                })
            }
        });
    }).catch(err => {
        console.log(err);
    });

}

main()