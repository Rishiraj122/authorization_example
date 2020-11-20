var express = require("express");
var app = express();
var passport = require("passport");
var bodyParser = require("body-parser");
var user = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app");

app.use(require("express-session")({
    secret: "Rusty is Really Cute!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//=====================
//ROUTES
//=====================





app.get("/", function(req, res) {
    res.render("home.ejs");
});

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret.ejs");
});

//=====================
//AUTH ROUTES
//=====================

app.get("/register", function(req, res) {
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    req.body.username;
    req.body.password;
    user.register(new user({ username: req.body.username }), req.body.password, function(error, user) {
        if (!error) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secret");
            });
        } else
            res.render("register.ejs");
    });
});


//LOGIN ROUTES
//render login form

app.get("/login", function(req, res) {
    res.render("login.ejs");
});

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {


});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, process.env.IP, function() {
    console.log("The Server Has Been Started...");
});