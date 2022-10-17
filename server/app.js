const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('./models/user.model');
require('dotenv').config();
const saltRounds = 10;
const app = express();
 require('./config/database');

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
require('./config/passportJwt');

// baseurl 
app.get("/",(req,res)=>{
    res.send("<h1>Welcom to the server</h1>")
})
// profile 
app.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        return res.status(200).send({
            success:true,
            user:{
                id:req.user._id,
                name:req.user.name,
            }
        })
    }
);
// register 
app.post("/register",async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
    if(user) return res.status(404).send("User already exists");
    bcrypt.hash(req.body.password, saltRounds, async(err, hash)=> {
        const {name,email}= req.body;
        const newUser = new  User({name:name,email:email,password:hash});
         await newUser.save()
         .then((user)=>{
            res.send({
                success:true,
                message:"User is created Successfully",
                user:{
                    id:user._id,
                    name:user.name,
                }
             })
         })
         .catch((error)=>{
            res.send({
                success:false,
                message:"User not created!",
            })
         })
         
    });
    } catch (error) {
        res.status(500).send(error.message);
    }
    
    
})
// login 
app.post("/login", async(req,res)=>{
 
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).send({
                success:false,
                message:"User not found!",
            })
        }
        if(!bcrypt.compare(req.body.password,user.password)){
            res.status(404).send({
                success:false,
                message:"Incorrect Password!",
            })
        }
        const payload ={
            id:user._id,
            name:user.name,
        }
       const token= jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn:"2d",
       })
       return res.status(200).send({
        success:true,
        message:"User is logged in successfully!",
        token:"Bearer " + token,
       })

   
})
// not found 
app.use((req,res,next)=>{
    res.status(404).json({
        message:"route not found"
    })
})
// server error 
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

module.exports = app;