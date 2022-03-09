import User from "../models/User"
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
            return `<b>${urlTitle(rssUrl)}</b> added successfully!`;
        } else {
            // check rss url is already added
            const rssUrlExists = user.rssUrl.find(url => url.url === rssUrl);
            if (rssUrlExists) {
                return `<b>${rssUrlExists.title}</b> already added!`;
            } else {
                // push the new url
                // checking if rssUrl array is 5
                // you can change the value to any number
                const arrayLength = user.rssUrl.length;
                const maxLength = 5;
                if (arrayLength >= maxLength) {
                    return "You can only add 5 RSS feeds. Please remove one RSS feed and try again.";
                }
                let title = urlTitle(rssUrl);
                // check if title is already added
                const titleExist = user.rssUrl.find(url => url.title === title);

                if(titleExist) {
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
                return `<b>${title}</b> added successfully!`;
            }
        }
    } catch (e) {
        return "Something went wrong"
    }
}
