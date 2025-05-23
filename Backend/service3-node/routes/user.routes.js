const express = require('express');
const router = express.Router();
const { verifyJWT, verifyJWTAnyUser } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

router.get('/:id', verifyJWT, userController.getUserDetails);// /api/users/:id
router.get('/', verifyJWT, userController.getAllUsers);//  /api/users


module.exports = router;