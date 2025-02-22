if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const session = require("express-session");
const Mongostore = require("connect-mongo");
const flash = require("connect-flash");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const db_Url = process.env.ATLASDB_URL;
// Calling to the main function
main()
.then((res) => {
    console.log("Connect Successfuly");
}).catch((err) => {
    console.log(err);
});

//  this url used to connect the DATABASE   wanderlust: this is collection name(db name);
async function main(){
    await mongoose.connect(db_Url);// insted of MONGO_URL we have to use db_Url to upload the website on the web
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// new mongodb session for project deploy
const store = Mongostore.create({
    mongoUrl: db_Url,
    crypto: {
        secret: process.env.SECRET,
    },     // (24 * 60 * 36) -> 24 hour
    touchAfter: 24 * 60 * 36, // Interval (in seconds) between session updates.
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOption = { 
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // most important thing (locals) we can define variable over here and access anywhere
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.get("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
    let {statusCode=505, message="Something Went Wrong"} = err;
    res.render("./listings/error.ejs", { error: message });
});
app.listen(9999, () => {
    console.log("server to listening to port:");
});


// username: apnacollege  password: 12346789