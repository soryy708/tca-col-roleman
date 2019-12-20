const request = require('request');

function getUserName(bot, serverId, str) {
    const server = bot.servers[serverId];
    const userMatch = Object.values(bot.users).find(user => user.username.toLowerCase() === str.toLowerCase());
    if (userMatch) {
        return userMatch.username;
    }
    const nickMatch = Object.values(server.members).find(member => member.nick && member.nick.toLowerCase() === str.toLowerCase());
    if (nickMatch) {
        return bot.users[nickMatch.id].username;
    }
    return null;
}

function setUserRoles(serverId, userId, roles) {
    // https://github.com/izy521/discord.io/issues/289#issuecomment-418552716
    return new Promise((resolve, reject) => {
        request({
            url: `https://discordapp.com/api/v6/guilds/${serverId}/members/${userId}`,
            headers: {
                'User-Agent': 'DiscordBot (Custom API request, 1.0)',
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify({roles: roles})
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }
            if (response.statusCode !== 204) {
                if (response.statusCode === 429) {
                    const retryTimeout = body.retry_after;
                    setTimeout(() => {
                        setUserRoles(serverId, userId, roles)
                            .then(body => resolve(body))
                            .catch(e => reject(e));
                    }, retryTimeout);
                } else {
                    reject(body);
                }
            }
            resolve(body);
        });
    });
}

module.exports = {
    getUserName,
    setUserRoles,
};
