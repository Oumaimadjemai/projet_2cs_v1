const express = require('express');
const router = express.Router();
const { verifyJWT, verifyJWTAnyUser } = require('../middleware/auth');
const themeController = require('../controllers/theme.controller');


// Routes deviendront /api/themes, /api/themes/my-choices, etc.
router.get('/', verifyJWT, themeController.getAvailableThemes); // /api/themes
// GET /api/themes - Returns all themes

// GET /api/themes?annee_etude=1 - Filters by study year

// GET /api/themes?annee_etude=1&specialite=1 - Filters by both year and specialty
router.get('/my-choices', verifyJWTAnyUser, themeController.getUserThemeChoices); // /api/themes/my-choices
router.post('/save-choices', verifyJWT, themeController.saveThemeChoices); // /api/themes/save-choices
router.get('/all-groups-choices', verifyJWTAnyUser, themeController.getAllGroupsChoices);
// Get all data: GET /api/themes/all-groups-choices

// Filter by 3rd year: GET /api/themes/all-groups-choices?annee_etude=1

// Filter by specialty 1: GET /api/themes/all-groups-choices?specialite=1

// Combined filter: GET /api/themes/all-groups-choices?annee_etude=1&specialite=1
 // /api/themes/all-groups-choices
 router.get('/submit', verifyJWT, themeController.submitsheThemeChoices); // /api/themes/submit


module.exports = router;