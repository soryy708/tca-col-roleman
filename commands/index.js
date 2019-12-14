const Router = require('./router');

const router = new Router();

router.use(require('./auth'));
router.use(require('./config'));
router.use(require('./grantRank'));
router.use(require('./help'));

function getCommandListener(keyword) {
    const command = router.getCommand(keyword);
    if (!command) {
        return null;
    }
    const callback = command.callback;
    return callback;
}

module.exports = {
    getCommandListener,
};
