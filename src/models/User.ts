import { Schema, model } from 'mongoose';

export interface UserTelegram {
    telegramId: string;
    rssUrl: [
        {
            url: string;
            title: string;
        }
    ];
}

const schema = new Schema<UserTelegram>({
    telegramId: { type: String, required: true },
    rssUrl: {
        type: [
            {
                url: String,
                title: String,
            },
        ],
    }
});


const UserTelegramModel = model<UserTelegram>('UserTelegram', schema);

export default UserTelegramModel;