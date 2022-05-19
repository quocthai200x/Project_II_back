const express = require("express");
const router = new express.Router();

const authHandlers = require("./modules/auth");
const userHandlers = require("./modules/users");
const settingHandlers = require("./modules/setting");
const chatHandlers = require("./modules/chat");

const uploadImage = require("./modules/external/uploadImage");
const dev = require('./modules/dev')

// Auth handler
router.get("/api/auth/check-user", authHandlers.checkUser); 
router.post("/api/auth/sign-up", authHandlers.signUp);
router.post("/api/auth/sign-in", authHandlers.signIn);


let authen = authHandlers.authenticatedMiddleware
// User handler 
router.get("/api/cards", authen, userHandlers.getCards);
router.post("/api/like-unlike", authen, userHandlers.likeAndUnlike);
router.get("/api/match", authen, userHandlers.getMatches);

// setting handler
router.put("/api/reset-password", authen, settingHandlers.resetPassword);
router.put("/api/update-profile", authen, settingHandlers.updateProfile);

// chat handler
router.get("/api/chat/list", authen, chatHandlers.getListChat);
router.post("/api/chat/message", authen, chatHandlers.sendMessage);
router.get("/api/chat/message", authen, chatHandlers.getMessage);
router.put("/api/chat/read-message", authen, chatHandlers.readMessage);

// other handler
router.post("/api/upload-image", authen, uploadImage);
router.get("/api/dev", dev);
module.exports = router;
