const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/', userController.createUser)
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.patch('/updateMe', userController.protect, userController.updateMe);
router.get('/isLoggedin/:token', userController.isLoggedin, userController.getCurrentUser);
router.get('/isLoggedin', userController.CheckLogin, userController.getCurrentUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser)

module.exports = router;
