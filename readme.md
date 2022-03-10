# DDD Bookmark bot

Telegram bot as [RSS Reader](https://t.me/ddd_bookmark_bot). User can add RSS feeds to the bot and can read them in the chat.

Bot is using [Telegram Bot API](https://core.telegram.org/bots/api) and [Node.js](https://nodejs.org/en/).

## Before you start

- Generate a bot token from [BotFather](https://t.me/botfather) and paste it to the `TELEGRAM_TOKEN` environment variable.

- Bot is using MongoDB as a database. Please, create a database for the bot and paste its name to the `MONGODB_URI` environment variable.

## Installation


The first step is to install the dependencies.

```bash
yarn
```

Now you can run the bot in development mode.

_Note: Before running the bot. You must set the `TELEGRAM_TOKEN` and `MONGODB_URI` environment variables._

```bash
yarn dev
```

## Usage

- `/start` - start the bot

- `/help` - show this help

- `/config URL` - add RSS feed to the bot

- `/list` - show all RSS feeds

- `/view TITLE` - show RSS feed items

- `/remove` - remove RSS feed from the bot

