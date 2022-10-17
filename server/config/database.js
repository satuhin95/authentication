const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGOO_URL;
mongoose.connect(url)
.then(()=>{
    console.log("Database is connected");
})
.catch((error)=>{
    console.log(error.message);
})