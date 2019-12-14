const Router = require('../router');

const router = new Router();

router.use(require('./auth'));
router.use(require('./setPassword'));

module.exports = router;
