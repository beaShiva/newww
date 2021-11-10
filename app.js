//jshint esversion:6
require('dotenv').config();
const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const Port = process.env.PORT || 3000;


const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect( "mongodb+srv://admin-shiva:Shiva123@cluster0.r6fug.mongodb.net/post");

const PostSchema = {
  title:String,
  content:String,
  name:String
};
const blogSchema = {
  name:String,
  email:{type:String, required:true, },
  password:{type:String, required:true}
};

const loginSchema = {
  email:{type:String, required:true, },
  password:{type:String, required:true}
};
const ContactSchema = {
  name:String,
  email:String,
  textarea:String
};
const reviewSchema ={
  name:String,
  email:String,
  star:Number,
  comment:String
};

const Post = new mongoose.model("Post",PostSchema);
const Blog = new mongoose.model("Blog",blogSchema);
const Login = new mongoose.model("Login",loginSchema);
const Contact = new mongoose.model("Contact",ContactSchema);
const Review = new mongoose.model("Review",reviewSchema);



app.get("/",function(req,res){
 


  Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts,
      
      });
  });
});

app.get("/compose",function(req,res){
    res.render("compose");   
  });

  app.post("/compose",function(req,res){
    const post = new Post({
      title:req.body.postTitle,
      content:req.body.postBody,
      name:req.body.postName
    });  
      post.save(function(err){
        if(!err){
          res.redirect("/");
        }
      });
  });

  app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;
    
      Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
          title: post.title,
          content: post.content
        });
      });
     
   
    });
   
    
    app.post("/",function(req,res){
      const newReview = new Review({
        name:req.body.name,
        email:req.body.email,
        star:req.body.star,
        comment:req.body.text
      });
      
      console.log(newReview);
     
    newReview.save(function(err){
      if(!err){
        res.render("feedback");
      }
      
      
    });
    
    });
app.get("/feedback",function(req,res){
  res.render("feedback");
});
   
    app.get("/contact",function(req,res){
      res.render("contact");  
    });
    app.post("/contact",function(req,res){
    const newContact = new Contact({
      name:req.body.name,
      email:req.body.email,
      textarea:req.body.textarea
    });
   
    newContact.save(function(err){
      if(!err){
        res.redirect("/");
      }
    });

    });
   
    
    app.get("/about",function(req,res){
      res.render("about");   
    });
    
   app.get("/login",function(req,res){
      res.render("login");   
    });
   app.post("/login",function(req,res){
     const username = req.body.email;
     const password = req.body.password;

    Blog.findOne({email:username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.redirect("/compose");
          }else{
            res.redirect("/error");
          }
        }
      }

    });
   });
  app.get("/sign",function(req,res){
    res.render("sign");
  });

  app.post("/sign",function(req,res){
    const newBlog =  new Blog({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    });
   
    newBlog.save(function(err){
      if(!err){
        res.redirect("/compose");
      }
    });
  });
  app.get("/error",function(req,res){
    res.render("error");
  });

  app.listen(Port,function(){
    console.log("server is running");
    });