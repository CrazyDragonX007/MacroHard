const Comment = require("../models/comment");

exports.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You must be logged in to do that!");
    res.redirect("/users/login");
}

exports.isOwner=function(req,res,next){
    if(req.isAuthenticated()){
        project.findById(req.params.id,function(err,proj){
            if(err){
                console.log(err);
            }else{
                if(proj.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("ERROR!");
                }
            }
        });
    }else{
        res.redirect("/users/login");
    }
}

exports.isCommOwner=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.cid,function(err,comm){
            if(err){
                console.log(err);
            }else{
                console.log(comm.author.id+"    "+req.user._id);
                if(comm.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("ERROR!");
                }
            }
        });
    }else{
        res.redirect("/users/login");
    }
}