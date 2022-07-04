const express = require('express');
const router = express.Router();
const webController = require('../controllers/web.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { v4: uuidv4 } = require('uuid');

// // router.get(['/'], (req, res) => {res.redirect(`/room/${uuidv4()}`)});
router.get(['/'], awaitHandlerFactory(webController.landingPageGet));
router.post(['/'], awaitHandlerFactory(webController.landingPagePost));
router.get(['/join/:room'], awaitHandlerFactory(webController.joinRoomGet));
router.get(['/error'], awaitHandlerFactory(webController.thankYou));
// router.get(['/end-meeting'], awaitHandlerFactory(userController.endMeeting));
// // router.get(['/end-meeting/:message'], awaitHandlerFactory(userController.endMeeting));
// router.get(['/login'], awaitHandlerFactory(userController.login));
// router.get(['/register'], awaitHandlerFactory(userController.register));
// router.get(['/join-meeting'], awaitHandlerFactory(userController.join_meeting));
// router.get(['/host-meeting'], awaitHandlerFactory(userController.host_meeting));
// router.get(['/my-meetings'], awaitHandlerFactory(userController.my_meetings));
// router.get(['/meeting-room/:room'], awaitHandlerFactory(userController.getConferenceToken),awaitHandlerFactory(userController.postConferenceWithToken),awaitHandlerFactory(userController.meetingRoom));
// router.post(['/meeting-room/:room'], awaitHandlerFactory(userController.postConferenceWithToken),awaitHandlerFactory(userController.meetingRoom));

module.exports = router;