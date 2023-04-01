require("alert-node");
const exp = require("express");
const app = exp();
const path = require("path");
const bodyP = require("body-parser"), mongoose = require("mongoose");
require("passport-local-mongoose");
require("./models/comment");
const passport = require("passport"), LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");
mongoose.connect("mongodb://localhost/macrohard",{useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(bodyP.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use("/public", exp.static(path.join(__dirname, 'public')));
app.use(flash());

// Authentication stuff

app.use(require("express-session")({
    secret: "abcd",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.get("/",function(req,res){
    res.render("home",{currentUser:req.user});
});

const users=require("./routes/users");
const projects=require("./routes/projects");
app.use('/users',users);
app.use('/projects',projects);


//CONTACT and About

app.get("/contact",function(req,res){
	res.render("contact");
});

app.listen(1400,function(){
    console.log("Server started");
});

