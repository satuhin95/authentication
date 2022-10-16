const express = require('express');
require('dotenv').config();
require('./config/passport');
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

// register
app.get("/register",(req,res)=>{
    res.render('register');
})
app.post("/register", async(req,res)=>{
    try {
        const user = await User.findOne({username:req.body.username})
        if(user){
            res.status(403).send("User already exists ")
        }
        bcrypt.hash(req.body.password, saltRounds, async(err, hash)=> {
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                password:hash
            });
               await newUser.save();
              res.redirect('/login')
        });
       
       
    } catch (error) {
        res.status(500).send(error.message)
    }
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

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login',successRedirect:'/profile' })
 );
// profile
app.get("/profile",checkedAuthenticated,(req,res)=>{
        res.render('profile');
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