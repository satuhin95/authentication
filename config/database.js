const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGOO_URL)
.then(()=>{
    console.log("DB is connected");
})
.catch((error)=>{
    console.log(error);
})