var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyparser = require('body-parser');
var User  	=   require('./models/user');
var localstrategy = require('passport-local');
var passportlocalmongoose =require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended : true}));
app.use(require('express-session')({
	secret : "It is a secret!",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
	res.render("home");
});

app.get("/secret",isLoggedin,function(req,res){
	res.render("secret");
});

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register", function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username : req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res,function(){
			res.redirect("/secret");
		});
	});

});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login",passport.authenticate("local", {
	successRedirect : "/secret",
	failureRedirect : "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000,'localhost',function(){
	console.log("Server has been started on Port 3000");
});