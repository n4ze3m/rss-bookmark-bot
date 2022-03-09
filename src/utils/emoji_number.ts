export const numberToEmoji = (number: number) => {
    const emoji: {
        [key: number]: string;
    } = {
        0: '0️⃣',
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
    }
    let emojiNumber = '';
    while (number > 0) {
        const digit = number % 10;
        emojiNumber = emoji[digit] + emojiNumber;
        number = Math.floor(number / 10);
    }
    return emojiNumber;
}