const Router = require('../router');

const router = new Router();

router.use(require('./prefix'));

module.exports = router;
