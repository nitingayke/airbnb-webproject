const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/users.js");

router.route("/signup")
    .get(listingController.renderSignupFom)
    .post(wrapAsync(listingController.userSignup));

router.route("/login")
    .get(listingController.loginFormRender)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), listingController.loginUser);


router.get("/logout", listingController.userLogout);

module.exports = router; 