require('dotenv').config();

const Discord = require('discord.io');
const commands = require('./commands');
const logUtil = require('./util/log');

let currentCommandId = 0;
function getCommandId() {
    return currentCommandId++;
}

const bot = new Discord.Client({
    token: process.env.DISCORD_TOKEN,
    autorun: true
});

bot.on('ready', (evt) => {
    logUtil.log('info', null, null, 'Connected');
});

bot.on('message', async (userName, userId, channelId, message, evt) => {
    if (message.startsWith(process.env.COMMAND_PREFIX || '!')) {
        const args = message.substring(1).split(' ');
        const cmd = args[0];
        
        const relevantCommand = commands.getCommandListener(cmd);
        if (relevantCommand) {
            const serverId = (bot.channels[channelId] || {}).guild_id;
            const commandId = getCommandId();

            logUtil.log('verbose', serverId, commandId, 'Received command', {command: cmd});

            try {
                await relevantCommand(bot, userName, userId, commandId, channelId, serverId, message, evt, args);
            } catch (e) {
                logUtil.log('error', serverId, commandId, 'Exception when processing command', {exception: e.toString(), stackTrace: e.stack});
                bot.sendMessage({
                    to: channelId,
                    message: `I encountered an error when processing this.\nYour commandId is ${commandId}. Please see the log for details.`,
                });
            }
        }
    }
});

bot.on('disconnect', (errorMessage, code) => {
    logUtil.log('error', null, null, 'Error connecting', {code, errorMessage});
});

process
    .on('unhandledRejection', (exception, promise) => {
        logUtil.log('error', null, null, 'Unhandled rejection at Promise', {exception: exception.toString(), stackTrace: exception.stack, promise});
    })
    .on('uncaughtException', exception => {
        logUtil.log('error', null, null, 'Uncaught exception thrown', {exception: exception.toString(), stackTrace: exception.stack});
    });
