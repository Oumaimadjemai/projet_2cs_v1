const express = require('express');
const router = express.Router();
const groupRoutes = require('./group.routes');
const userRoutes = require('./user.routes');
const themeRoutes = require('./theme.routes');

router.use('/groups', groupRoutes);
router.use('/users', userRoutes);
router.use('/themes', themeRoutes);

module.exports = router;