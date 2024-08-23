const User = require("../models/user.js");

module.exports.renderSignupFom = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.userSignup = async(req, res, next) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if(err){
                next(err);
            }
            req.flash("success", "Wellcome To Wanderlust");
            res.redirect("/listings");
        });
        
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/listings");
    }
};

module.exports.loginFormRender = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.loginUser = async(req, res) => {
    req.flash("success", "WelCome to wanderlust, you are login.");
    let redirectURL = res.locals.redirectUrl || "/Listings";
   
    res.redirect(redirectURL);
};

module.exports.userLogout = (req, res) => {
    req.logout((err) => {
        if(err){
            next(err);
        }

        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};