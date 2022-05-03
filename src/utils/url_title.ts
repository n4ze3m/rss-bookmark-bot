import Parser from "rss-parser";
const parser = new Parser();

export const urlTitle = async (url: string) => {
    const feed = await parser.parseURL(url);
    return feed.title || "Your RSS feed from " + urlShort(url);
}

export const urlShort = (url: string) => {
    // domain name with extension without protocol
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    return domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
}
