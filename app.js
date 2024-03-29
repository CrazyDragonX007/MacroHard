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
const {db_string, port, session_secret} = require('./config');
mongoose.connect(db_string,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false }).then(()=>console.log("db connected"));
app.set("view engine","ejs");
app.use(bodyP.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use("/public", exp.static(path.join(__dirname, 'public')));
app.use(flash());

// Authentication stuff

app.use(require("express-session")({
    secret: session_secret,
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

app.get("/about",function (req,res){
    res.render("about");
})

app.listen(port,function(){
    console.log("Server started");
});

