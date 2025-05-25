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
router.get('/all-groups-choices', verifyJWTAnyUser, themeController.getAllGroupsChoices); // /api/themes/all-groups-choices
// Filter by  year: GET /api/themes/all-groups-choices?annee_etude=1

// Filter by specialty 1: GET /api/themes/all-groups-choices?specialite=1

// Combined filter: GET /api/themes/all-groups-choices?annee_etude=1&specialite=1

// Get all data: GET /api/themes/all-groups-choices
router.get('/:groupId/choices',verifyJWTAnyUser,themeController.getGroupChoicesById);//ex:localhost:3000/api/themes/6830782bacb16276e014ab3f/choices


 router.post('/submit', verifyJWT, themeController.submitsheThemeChoices); // /api/themes/submit


module.exports = router;