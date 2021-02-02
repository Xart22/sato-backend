const mongoose = require("mongoose")



const userShcema = new mongoose.Schema({
    username : {type:String},
    email : {type:String,required:true},
    passwordHas : {type:String,required:true},
    phone:{type:String},
    alamat:{type:String},
    avatar:{type:String},
    favorit:{type:String},
})

const User = mongoose.model("user", userShcema)

module.exports= User;