const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
router.post('/',userController.register);
router.get('/profile',[authMiddleware.checkAuthenticated],userController.profile);
router.get('/balance',[authMiddleware.checkAuthenticated],userController.getBalance);

module.exports = router;
 