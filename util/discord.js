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

module.exports = {
    getUserName,
};
