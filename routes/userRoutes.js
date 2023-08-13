const { Router } = require('express');
const express = require('express');
const router= express.Router();
const userController = require('../controller/userController')

router.route('/creatUser').post(userController.uploadUserphoto,userController.creatUser)
router.route('/loginUser').post(userController.loginUser)
router.route('/sendFriendRequest').post(userController.sendFriendRequest)
router.route('/acceptFriendRequest').post(userController.acceptRequest)
router.route('/getData').post(userController.getdata)
router.route('/getFriendSuggestion').get(userController.getFriendSuggestion)
router.route('/creatPost').post(userController.uploadUserphoto,userController.creatPost)
router.route('/getmyfriendrequest').get(userController.getmyfriendrequest)
router.route('/unfriendUser').post(userController.unfriendUser)
router.route('/getPost').get(userController.getPost)
router.route('/likePost').post(userController.likePost)


module.exports = router