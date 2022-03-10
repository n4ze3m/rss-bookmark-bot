import TelegramBot from "node-telegram-bot-api";
import { UserTelegram } from "../models/User";

export const generateKeyboard = (user: UserTelegram) => {
    const keyboard: TelegramBot.KeyboardButton[][] = [];
    for (let i = 0; i < user.rssUrl.length; i++) {
        keyboard.push([{ text: `/view ${user.rssUrl[i].title}` }]);
    }
    return keyboard
}


export const generateInlineKeyboard = (user: UserTelegram) => {
    const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
    for (let i = 0; i < user.rssUrl.length; i++) {
        keyboard.push([{ text: `${user.rssUrl[i].title}`, callback_data: `${user.rssUrl[i].title}` }]);
    }
    return keyboard
}