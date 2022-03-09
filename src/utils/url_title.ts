export const urlTitle = (url: string) => {
    // domain name with extension without protocol
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    return domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
}
