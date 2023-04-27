const User = require("../models/user");
const Comment = require("../models/comment");
const project = require("../models/project");
const exp = require("express");
const router = exp.Router();
const {isOwner,isCommOwner,isLoggedIn} = require("../utils/auth");
const {uploadImage} = require("../utils/s3");
router.get("/new",isLoggedIn,function(req,res){
    res.render("new");
});

router.get("/Softprojects",function(req,res){
    project.find({category:0},function(err, Allprojects){
            if(err){
                console.log(err);
            }else{
                res.render("Sindex",{projects:Allprojects});
            }
        }
    )});

router.get("/Hardprojects",function(req,res){
    project.find({category:1},function(err, Allprojects){
            if(err){
                console.log(err);
            }else{
                res.render("Hindex",{projects:Allprojects});
            }
        }
    )});

router.post("/",uploadImage.single('image'),function(req,res){
    console.log(req.file);
    const imagePath = req.file.location;
    const title = req.body.title, description = req.body.description, cat = req.body.category, price = req.body.price,
        author = {
            id: req.user._id,
            username: req.user.username
        }, newProject = {title: title, description: description, category: cat, price: price, author: author, imagePath:imagePath};
    project.create(newProject,function(err,newP){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
            req.flash("Successfully created new project");
        }
    });
});

router.get("/:id",function(req,res){
    project.findById(req.params.id).populate("comments").exec(function(err,proj){
        if(err){
            console.log(err);
        }else{
            User.findById(proj.author.id,function(err,usr){
                if(err){
                    console.log(err);
                }else{
                    res.render("show",{project:proj,user:usr});
                }
            })

        }
    });
});

// Edit and Delete

router.get("/:id/edit",isOwner,function(req,res){
    // console.log(project.findById(req.params.id));
    project.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }else{
            res.render("projEdit",{proj:found});
        }
    });
});

router.put("/:id",isOwner,function(req,res){
    project.findByIdAndUpdate(req.params.id,req.body.Uproj,function(err,nProj){
        if(err){
            console.log(err);
        }else{
            res.redirect("/projects/"+req.params.id);
        }
    })
});

router.delete("/:id",isOwner,function(req,res){
    project.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })
})

// COMMENTS STUFF

router.get("/:id/comments/new",isLoggedIn,function(req,res){
    project.findById(req.params.id,function(err,project){
        if(err){
            console.log(err);
        }else{
            res.render("newC",{project:project});
        }
    });
});

router.post("/:id/comments",isLoggedIn,function(req, res) {
    project.findById(req.params.id,function(err, project){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            var author={id:req.user._id,username:req.user.username};
            var comment={text:req.body.comment,author};
            Comment.create(comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    project.comments.push(comment);
                    project.save();
                    req.flash("success","Thank you for your feedback");
                    res.redirect("/projects/"+project._id);
                }
            });
        }
    });
});

router.get("/:id/comments/:cid/edit",isCommOwner,function(req,res){
    Comment.findById(req.params.cid,function(err,comm){
        if(err){
            console.log(err);
        }else{
            res.render("cedit",{project:req.params.id,comment:comm});
        }
    });
});
router.put("/:id/comments/:cid",isCommOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,comm){
        if(err){
            console.log(err);
        }else{
            res.redirect("/projects/"+req.params.id);
        }
    });
});

router.delete("/:id/comments/:cid",isCommOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.cid,function(err,comm){
        if(err){
            console.log(err);
        }else{
            req.flash("success","your comment has been deleted!!");
            res.redirect("/projects/"+req.params.id);
        }
    })
})

module.exports = router;
