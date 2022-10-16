const express = require('express');
require('dotenv').config();
require('./config/passportgoogleauth20');
const cors = require('cors');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const User = require('./models/user.model')
require('./config/database')
app.set("view engine","ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl:process.env.MONGOO_URL,
    collectionName:"sessions"
  }),
//   cookie: { secure: true }
}))
// passport 
app.use(passport.initialize());
app.use(passport.session());

// route 
app.get("/",(req,res)=>{
    res.render('index');
})



const checkedLoggedIn = (req,res,next)=>{
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    next();
}
const checkedAuthenticated = (req,res,next)=>{
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
// Login
app.get("/login",checkedLoggedIn,(req,res)=>{
    res.render('login');
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login',successRedirect:'/profile' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
// profile
app.get("/profile",checkedAuthenticated,(req,res)=>{
        res.render('profile',{username:req.user.username});
})
// logout
app.get("/logout",(req,res)=>{
    try {
        req.logOut((err)=>{
            if(err){
                return next(err)
            }
            res.redirect('/')
        })
        
    } catch (error) {
        res.status(500).send(error.message)
    }
})


module.exports = app;