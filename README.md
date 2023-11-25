# Discord Message Tracker Bot

The Discord Message Tracker Bot is a simple Discord bot designed to monitor messages from specified users within a channel. The bot serves as a tool to track and log messages, providing insights into user activity on the server.

## Features

- **Message Monitoring:** The bot monitors messages from specified users within the designated channel.
- **Owner Notifications:** The bot sends notifications to the bot owner (creator) about new messages from monitored users.
- **User Profile Tracking:** The bot keeps track of user profiles, recording relevant information.
- **Express Dashboard:** The bot comes with an integrated Express server that provides a dashboard for managing bot-related functionalities through REST APIs.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/PrantaDas/discord-message-tracker-bot.git
    cd discord-message-tracker-bot
    ```

2. Install dependencies:

    ```bash
    npm install or yarn
    ```

3. Set up environment variables:

    Create a `config` folder in the root directory and add a `dev.env` file inside with the following variables:

    ```
    BOT_TOKEN=your_discord_bot_token
    MONGODB_URL=your_mongodb_connection_url
    SECRET_KEY=your_jwt_secret_key
    ```

4. Run the bot:

    ```bash
    yarn dev or npm run dev
    ```
<br/>

![Screenshot](./asset//Screenshot%202023-11-26%20000645.png)