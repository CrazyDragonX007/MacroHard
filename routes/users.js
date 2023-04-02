const User = require("../models/user");
const alert = require("alert-node");
const passport = require("passport");
const exp = require("express");
const router = exp.Router();

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username, email: req.body.email, contact: req.body.contact}), req.body.password, function(err, user){
        if(err){
            alert(err.message);
            // var a=String(err.message);
            // alert("error");
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Thank you for registering. Welcome to MacroHard "+ user.username);
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login"
}) ,function(req, res){
});

router.get("/logout", function(req, res){
    req.logout(function(err) {
        if (err) { console.log(err); }
        req.flash("success","You have been logged out!!");
        res.redirect('/');
    });
});

module.exports = router;