const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login',userController.login);
router.post('/logout',[authMiddleware.checkAuthenticated],userController.logout);

module.exports = router;