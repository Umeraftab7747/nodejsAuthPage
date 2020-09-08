const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdata', { useNewUrlParser: true, useUnifiedTopology: true });


const Userdata = mongoose.model("SignupUser", {


    name: String,
    email: String,
    password: String



})


module.exports = Userdata