const auth = require('../../util/auth');
const logUtil = require('../../util/log');
const stateFileUtil = require('../../util/stateFile');
const Router = require('../router');

const router = new Router();

router.command('set-prefix', ['New Prefix'], 'Change what prefix I should look for', async (bot, userName, userId, commandId, channelId, serverId, message, evt, args) => {
    if (args.length <= 1) {
        bot.sendMessage({
            to: channelId,
            message: 'Missing argument',
        });
        return;
    }

    const newPrefix = args.slice(1).join(' ');
    const isAuthenticated = await auth.isAuthenticated(userId);
    if (isAuthenticated) {
        await stateFileUtil.setState('config.json', {prefix: newPrefix});
        bot.sendMessage({
            to: channelId,
            message: 'Prefix changed',
        });
        logUtil.log('info', serverId, commandId, 'Prefix changed', {requestor: userName, newPrefix});

    } else {
        bot.sendMessage({
            to: channelId,
            message: 'Authentication required',
        });
    }
});

module.exports = router;
