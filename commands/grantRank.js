const auth = require('../util/auth');
const logUtil = require('../util/log');
const Router = require('./router');

const router = new Router();

const ranks = [
    '[CA - ❱]',
    '[CA - ❱❱]',
    '[CA - ❱❱❱]',
    '[CA - ❚]',
    '[CA - ❚❚]',
    '[CA - ❚❚❚]',
    '[CA - ☆]',
    '[CA - ★]',
];

router.command('grant-rank', ['Rank Index', 'Person'], 'Change "Person"s nickname to rank with "Rank Index"', async (bot, userName, userId, commandId, channelId, serverId, message, evt, args) => {
    if (args.length <= 1) {
        bot.sendMessage({
            to: channelId,
            message: 'Missing arguments: `Rank Index`, `Person`',
        });
        return;
    }
    if (args.length <= 2) {
        bot.sendMessage({
            to: channelId,
            message: 'Missing argument: `Person`',
        });
        return;
    }

    const rankIndex = args[1];
    const person = args.slice(2).join(' ');
    const isAuthenticated = await auth.isAuthenticated(userId);
    if (!isAuthenticated) {
        bot.sendMessage({
            to: channelId,
            message: 'Authentication required',
        });
        return;
    }

    if (rankIndex < 0 || rankIndex >= ranks.length) {
        bot.sendMessage({
            to: channelId,
            message: `Invalid \`Rank Index\`. Has to be in range: [${0}-${ranks.length}].`,
        });
        return;
    }
    const rankName = ranks[rankIndex];

    const targetUser = Object.values(bot.users).find(user => user.username.toLowerCase() === person.toLowerCase());
    if (!targetUser) {
        bot.sendMessage({
            to: channelId,
            message: `I don't know who "${targetUser.username}" is.`,
        });
        return;
    }

    const targetUserId = targetUser.id;
    await new Promise((resolve, reject) => {
        bot.editNickname({
            serverID: serverId,
            userID: targetUserId,
            nick: `${rankName} ${targetUser.username}`,
        }, (err, res) => {
            if (err) {
                reject (err);
                return;
            }
            resolve(res);
        });
    });
    
    bot.sendMessage({
        to: channelId,
        message: `${targetUser.username}'s rank has been changed to ${rankName}.`,
    });
    logUtil.log('info', serverId, commandId, 'Rank changed', {requestor: userName, targetUser: targetUser.username, newRank: rankName});
});

module.exports = router;
