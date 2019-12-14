const auth = require('../../util/auth');
const logUtil = require('../../util/log');
const Router = require('../router');

const router = new Router();

router.command('set-password', ['New Password'], 'Change the admin password, un-authenticating everyone', async (bot, userName, userId, commandId, channelId, serverId, message, evt, args) => {
    if (args.length <= 1) {
        bot.sendMessage({
            to: channelId,
            message: 'Missing argument',
        });
        return;
    }

    const newPassword = args.slice(1).join(' ');
    const isAuthenticated = await auth.isAuthenticated(userId);
    if (isAuthenticated) {
        await auth.setPassword(userId, newPassword);
        bot.sendMessage({
            to: channelId,
            message: 'Admin password changed',
        });
        logUtil.log('info', serverId, commandId, 'Admin password changed', {requestor: userName});

    } else {
        bot.sendMessage({
            to: channelId,
            message: 'Authentication required',
        });
    }
});

module.exports = router;
