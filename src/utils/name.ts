import TelegramBot from "node-telegram-bot-api";

export const telegramUserName = (msg:TelegramBot.Message) => {
    let name = ''
    if(msg.chat.first_name) {
        name = msg.chat.first_name
    } else if(msg.chat.last_name) {
        name = msg.chat.last_name
    } else {
        name = msg.chat.username || "User"
    }
    return name
}