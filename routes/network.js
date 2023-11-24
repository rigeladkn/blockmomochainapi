const express = require('express');
const router = express.Router();
const initController = require('../controllers/init.controller');
const networkController = require('../controllers/network.controller');
// const authMiddleware = require('../middlewares/authMiddleware');
router.post('/configure',initController.configureNetwork);
router.get('/status',networkController.getNetworkStatus);

module.exports = router;