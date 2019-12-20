const auth = require('../util/auth');
const logUtil = require('../util/log');
const Router = require('./router');
const discordUtil = require('../util/discord');

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
    const isAuthenticated = auth.isAuthenticated(userId);
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
            message: `Invalid \`Rank Index\`. Has to be in range: [${0}-${ranks.length - 1}].`,
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

    const server = bot.servers[serverId];
    const relevantServerRoles = Object.values(server.roles).filter(serverRole => {
        return ranks.reduce((prev, rank) => (prev || serverRole.name.includes(rank)), false);
    });
    const serverRoles = relevantServerRoles.map(serverRole => [serverRole.name, serverRole.id]);
    const currentRoleIds = server.members[targetUserId].roles;
    const removedRoleIds = currentRoleIds.filter(roleId => {
        return serverRoles.reduce((prev, [serverRoleName, serverRoleId]) => (prev || serverRoleId === roleId), false);
    });
    const filteredRoleIds = currentRoleIds.filter(roleId => {
        return !removedRoleIds.reduce((prev, removedRoleId) => (prev || removedRoleId === roleId), false);
    });
    let role = serverRoles.find(([roleName]) => roleName.includes(rankName));
    if (!role) {
        role = await (async()=>{
            const createdRole = await new Promise((resolve, reject) => {
                bot.createRole(serverId, (error, res) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(res);
                });
            });
            await new Promise((resolve, reject) => {
                bot.editRole({
                    serverID: serverId,
                    roleID: createdRole.id,
                    name: rankName,
                    color: '#4eb146',
                    hoist: false,
                    mentionable: false,
                }, (error, res) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(res);
                });
            });
            return [rankName, createdRole.id];
        })();
    }
    const newRoles = filteredRoleIds.concat(role[1]);
    await discordUtil.setUserRoles(serverId, targetUserId, newRoles);
    
    bot.sendMessage({
        to: channelId,
        message: `${targetUser.username}'s rank has been changed to ${rankName}.`,
    });
    logUtil.log('info', serverId, commandId, 'Rank changed', {requestor: userName, targetUser: targetUser.username, newRank: rankName});
});

module.exports = router;
