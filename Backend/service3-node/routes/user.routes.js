const express = require('express');
const router = express.Router();
const { verifyJWT, verifyJWTAnyUser } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

router.get('/:id', verifyJWT, userController.getUserDetails);
router.get('/', verifyJWT, userController.getAllUsers);
router.get('/invitations', verifyJWT, userController.getUserInvitations);

module.exports = router;