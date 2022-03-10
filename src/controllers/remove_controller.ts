import User from "../models/User";
import { generateInlineKeyboard, generateKeyboard } from "../utils/keyboard";

export const chooseRssToDelete = async (telegramId: string) => {
    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return {
                message: "You haven't added any RSS feeds yet.",
                error: true,
                keyboard: []
            }
        } else {
            const rssFeedLength = user.rssUrl.length;

            if (rssFeedLength <= 0) {
                return {
                    message: "You haven't added any RSS feeds yet.",
                    error: true,
                    keyboard: []
                }
            }

            const keyboard = generateInlineKeyboard(user);
            const message = "Choose the RSS feed you want to remove.";
            return {
                message,
                error: false,
                keyboard,
            }
        }
    } catch (error) {
        return {
            message: "Something went wrong. Please try again.",
            error: true,
            keyboard: []
        }
    }
}


export const removeRss = async (telegramId: string, title: string) => {
    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return {
                message: "You haven't added any RSS feeds yet.",
                error: true,
                keyboard: []
            }
        } else {
            const rssFeedLength = user.rssUrl.length;

            if (rssFeedLength <= 0) {
                return {
                    message: "You haven't added any RSS feeds yet.",
                    error: true,
                    keyboard: []
                }
            }

            const rssUrl = user.rssUrl.find(url => url.title === title);

            if (!rssUrl) {
                return {
                    message: "Input title is not found in your RSS feeds. Please check the title and try again.",
                    error: true,
                    keyboard: []
                }
            }

            const rssUrlIndex = user.rssUrl.indexOf(rssUrl);

            user.rssUrl.splice(rssUrlIndex, 1);
            await user.save();

            const keyboard = generateKeyboard(user);
            const message = `RSS feed (${title}) removed successfully.`;
            return {
                message,
                error: false,
                keyboard,
            }
        }
    } catch (error) {
        return {
            message: "Something went wrong. Please try again.",
            error: true,
            keyboard: []
        }
    }
}