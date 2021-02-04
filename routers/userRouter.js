const bcrypt = require("bcrypt")
const router = require("express").Router()
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")


// REGISTER

router.post("/", async (req,res)=>{
    try {
        const{email,password,passwordVertif,username} = req.body
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (!email)
        return res.status(400).json({errorMassage: "Email must not be empty"});

        if (!email.match(re))
        return res.status(400).json({errorMassage: "Email must be a valid email address"});

        if(!email || !password || !passwordVertif)
        return res.status(400).json({errorMassage: "Please Check Your data"});

        if(password.lenght < 8 )
        return res.status(400).json({errorMassage: "Password Must Be 8 character"});

        if(password !== passwordVertif )
        return res.status(400).json({errorMassage: "Password do not match"});

        const existEmail =await User.findOne({email});
        if(existEmail)
        return res.status(400).json({errorMassage: "Email already exists, please login"});

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,passwordHash,username
        })

        const savedUser = await newUser.save();

        const token = jwt.sign({
            user:savedUser._id
        },process.env.JWT_SECRET)

        res.cookie("token",token,{
            httpOnly:true,            
        }).send()

    } catch (error) {
        console.error(error);
        res.status(500).send()
    }
})


// LOGIN

router.post("/login",async (req,res)=>{
    try {
        var{email,password,username} = req.body

        let conditions = !!username ? username= {username} : email= {email};
     
        if(!conditions || !password)
        return res.status(400).json({errorMassage: "Please Check Your data"});

        const userexist = await User.findOne(conditions)
        console.log(userexist)
        if(!userexist)
        return res.status(400).json({errorMassage: "Email or username not registered"});

        const passwordCorrect =  await bcrypt.compare(password, userexist.passwordHash);
        if(!passwordCorrect)
        return res.status(400).json({errorMassage: "Wrong email or password"});

        const token = jwt.sign({
            user:userexist._id,
        },process.env.JWT_SECRET)

        res.cookie("token",token,{
            httpOnly:true,            
        }).send()


    } catch (error) {
        console.error(error);
        res.status(500).send()
    }
})


router.get("/logout",(req,res)=>{
    res.cookie("token","",{
        httpOnly:true,
        expires:new Date(0)
    }).send()
})

module.exports = router;