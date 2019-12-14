# Purpose

This [Discord](https://discordapp.com/) bot changes the Discord users nickname to display their rank.

---

# User Manual

* To add the bot to your server, Navigate to `https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=8` (replace `YOUR_CLIENT_ID` with the client ID of the Discord application). You must have the appropriate permissions on that server.
* The bot reacts to commands issued to it. You can issue it commands through DM, or by writing the command in any channel the bot is in.
* For a full list of available commands, use the `!help` command.

## Files

The bot creates, reads, and writes to files on the file system in order to work.
Make sure it is able to do so.

* `secrets.txt`: An encrypted file storing credentials, like those used to authenticate with the bot or with TeamSpeak.
* `secrets_iv.txt`: An "initialization vector" for the encryption of `secrets.txt`. Deleting this will corrupt `secrets.txt` and make its content irrecoverable.
* `config.json`: Stores non-sensitive configuration information.

---

# Contributing

## Getting started

* Download and install [NodeJS](https://nodejs.org/en/download/)
* Run `npm install`
* Follow the "initialization" steps (listed below)
* Run `npm start` to start the bot.
* Run `npm run package` to make an `.exe` file out of the bot.

### Initialization
1. [Create a Discord application](https://discordapp.com/developers/applications/)
2. Get a token and a client ID
3. Place the token in your environment variables as `DISCORD_TOKEN`
4. Navigate to `https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=8` (replace `YOUR_CLIENT_ID` with the client ID of the Discord application)
