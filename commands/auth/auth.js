const auth = require('../../util/auth');
const logUtil = require('../../util/log');
const Router = require('../router');

const router = new Router();

router.command('auth', ['Password'], 'Authenticate as an administrator', async (bot, userName, userId, commandId, channelId, serverId, message, evt, args) => {
    if (args.length <= 1) {
        const isAuthenticated = await auth.isAuthenticated(userId);
        if (isAuthenticated) {
            bot.sendMessage({
                to: channelId,
                message: 'Already authenticated',
            });
        } else {
            bot.sendMessage({
                to: channelId,
                message: 'Missing argument',
            });
        }
        return;
    }

    const password = args.slice(1).join(' ');
    const isAuthenticated = await auth.authenticate(userId, password);
    if (isAuthenticated) {
        bot.sendMessage({
            to: channelId,
            message: 'You are now authenticated',
        });
        logUtil.log('info', serverId, commandId, 'Admin authentication success', {requestor: userName});
    } else {
        bot.sendMessage({
            to: channelId,
            message: 'Authentication failure has been logged',
        });
        logUtil.log('info', serverId, commandId, 'Admin authentication failure', {requestor: userName});
    }
});

module.exports = router;
