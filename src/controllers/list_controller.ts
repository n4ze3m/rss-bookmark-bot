import TelegramBot from "node-telegram-bot-api";
import Parser from "rss-parser";
import User from "../models/User";
import { numberToEmoji } from "../utils/emoji_number";
import { generateKeyboard } from "../utils/keyboard";
const parser = new Parser();

export const getUserBookmarks = async (telegramId: string) => {
    try {
        const user = await User.findOne({ telegramId });
        
        if (!user) {
            return  {
                message: "You don't have any bookmarks yet.\n\n Please /config your  RSS url to get started." ,  error: true, keyboard: []
            }
        }
        const message = user.rssUrl.map((url, i) => `${numberToEmoji(i + 1)} - <b>${url.title}</b>`).join("\n\n");
        const keyboard = generateKeyboard(user);

        let title:string = ""
        if(keyboard.length === 0) {
            title = "Oh no! You don't have any bookmarks 🏷️"
        } else {
            title = "<b>Your bookmarks 🏷️</b>"
        }
        
        return {
            message: `${title}\n\n${message}`,
            error: false,
            keyboard
        }
    } catch (e) {
        return {
            message: "Invalid RSS url. Please remove the url and try again with RSS.", error: true, keyboard: []
        }
    }
}

export const getRSSFeed = async (telegramId: string,rssUrl: string) => {
    try {
        const user = await User.findOne({ telegramId });
        if(!user) {
            return "You don't have any RSS feeds yet.\n\n Please /config your  RSS url to get started."
        }
        const rssUrlExists = user.rssUrl.find(url => url.title === rssUrl);
        if (!rssUrlExists) {
            return "Input url is not found in your RSS feeds. Please check the url and try again."
        }
        const feed = await parser.parseURL(rssUrlExists.url);
        if(feed.items.length > 20) {
            feed.items = feed.items.slice(0, 20);
        }
        const items = feed.items.map((item, i) => `${numberToEmoji(i + 1)} - <a href=\"${item.link}\"> <b>${item.title}</b> </a>`).join("\n\n");
        const title = feed.title || "Your RSS feed from " + rssUrlExists.title;
        return `<b>${title}</b>\n\n${items}`;
    }catch(e) {
        return "Invalid RSS url. Please remove the url and try again with RSS."
    }
}