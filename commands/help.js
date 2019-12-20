const Router = require('./router');

const router = new Router();

router.command('help', [], 'Show this message', async (bot, userName, userId, commandId, channelId) => {
    /**
     * Send a Discord message after a period of time, to avoid hitting rate limit
     */
    const sendDeferredMessage = (() => {
        const timeoutDelay = 1500;
        const messageQueue = [];
        let interval = null;

        return (message) => {
            messageQueue.push(message);
            if (!interval) {
                interval = setInterval(() => {
                    if (messageQueue.length === 0) {
                        clearInterval(interval);
                        interval = null;
                        return;
                    }
                    const msg = messageQueue.shift();
                    bot.sendMessage({
                        to: channelId,
                        message: msg,
                    });
                }, timeoutDelay);
            }
        };
    })();

    const commandPrefix = process.env.COMMAND_PREFIX || '!';

    function printTree(node, depth = 0, name = '') {
        function commandsToDescrptions(commands) {
            return commands.map(command => {
                const keyword = command.keyword;
                const args = command.parameters;
                const description = command.description;
                const commandText = `${commandPrefix}${keyword}`;
                const argumentsText = `${args.map(argument => `(${argument})`).join(' ')}`;
                const spacer = argumentsText.length > 0 ? ' ' : '';
                return `<${commandText}${spacer}${argumentsText}> /* ${description} */`;
            });
        }

        const commandsDescription = commandsToDescrptions(node.commands).join('\n');

        const lines = [];
        if (commandsDescription !== '') {
            lines.push('```md', commandsDescription, '```');
        }
        if (name !== '') {
            lines.unshift(`${name}:`);
        }
        sendDeferredMessage(lines.join('\n'));

        Object.keys(node.children || []).forEach(childName => {
            printTree(node.children[childName], depth + 1, childName);
        });
    }
    
    const commandsTree = router.getAllCommandsAsTree();
    printTree(commandsTree);
});

module.exports = router;
