import User from "../models/User"
import { generateKeyboard } from "../utils/keyboard";
import { urlTitle } from "../utils/url_title";

export const configRssUrl = async (telegramId: string, rssUrl: string) => {
    try {
        // check if the user already exists
        const user = await User.findOne({ telegramId });
        if (!user) {
            // create a new user
            const newUser = new User({
                telegramId,
            });
            // push the new url
            newUser.rssUrl.push({
                url: rssUrl,
                title: urlTitle(rssUrl),
            });
            await newUser.save();
            const keyboard = generateKeyboard(newUser);
            const message = `<b>${urlTitle(rssUrl)}</b> added successfully!`;
            return {
                message,
                error: false,
                keyboard,
            }
        } else {
            // check rss url is already added
            const rssUrlExists = user.rssUrl.find(url => url.url === rssUrl);
            if (rssUrlExists) {
                const message = `<b>${rssUrlExists.title}</b> already added!`;
                const keyboard = generateKeyboard(user);
                return {
                    message,
                    error: false,
                    keyboard,
                }
            } else {
                // push the new url
                // checking if rssUrl array is 5
                // you can change the value to any number
                const arrayLength = user.rssUrl.length;
                const maxLength = 5;
                if (arrayLength >= maxLength) {
                    return {
                        message: "You can only add 5 RSS feeds. Please remove one RSS feed and try again.",
                        error: true,
                        keyboard: generateKeyboard(user),
                    }
                }
                let title = urlTitle(rssUrl);
                // check if title is already added
                const titleExist = user.rssUrl.find(url => url.title === title);

                if (titleExist) {
                    const sameTitle = user.rssUrl.filter(url => {
                        // match the title using regex
                        return url.title.match(new RegExp(title, "i"));
                    });
                    const count = sameTitle.length;
                    title = `${title} (${count})`;
                }

                user.rssUrl.push({
                    url: rssUrl,
                    title,
                });
                await user.save();
                const keyboard = generateKeyboard(user);
                const message = `<b>${title}</b> added successfully!`;
                return {
                    message,
                    error: false,
                    keyboard,
                }
            }
        }
    } catch (e) {
        return {
            message: "Something went wrong. Please try again.",
            error: true,
            keyboard: [],
        }
    }
}
