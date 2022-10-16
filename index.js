const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app')


const port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`Server is running port ${port}`)
})