const express = require('express');
const router = express.Router();
const { verifyJWT, verifyJWTAnyUser, verifyAdmin} = require('../middleware/auth');
const groupController = require('../controllers/group.controller');

router.post('/create-group', verifyJWT, groupController.createGroup);

router.get('/user', verifyJWT, groupController.getUserGroups);
router.post('/:groupId/invite/:userId', verifyJWT, groupController.inviteUser);
router.post('/:groupId/accept', verifyJWT, groupController.acceptInvitation);
router.post('/:groupId/decline', verifyJWT, groupController.declineInvitation);
router.get('/chef-theme-choices', verifyJWT, groupController.getChefThemeChoices);
router.post('/:id/recalculate-average', verifyJWT, groupController.recalculateAverage);
router.get('/averages', verifyJWTAnyUser, groupController.getGroupsAverages);
router.get('/by-study-year', verifyJWTAnyUser, groupController.getGroupsByStudyYear);
router.get('/by-study-year-specialty', verifyJWTAnyUser, groupController.getGroupsByYearAndSpecialty);
router.get('/invitations', verifyJWT, groupController.getUserInvitations);
router.get('/', verifyJWTAnyUser, groupController.getAllGroups);
router.post('/:groupId/assign/:userId', verifyAdmin,groupController.assignUserToGroup);

router.get('/:id', verifyJWTAnyUser, groupController.getGroupById);
router.get('/:id/members', verifyJWTAnyUser, groupController.getGroupMembers);

module.exports = router;