const { model, Schema } = require("mongoose");



const userShcema = new Schema({
    email : String,
    passwordHash : String,
    username :String ,
    phone:String,
    alamat:String,
    avatar:String,
    favorit:String,
})

module.exports= model("User",userShcema);