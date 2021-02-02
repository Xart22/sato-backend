const bcrypt = require("bcrypt")
const router = require("express").Router()
const User = require("../models/userModel")

router.post("/", async (req,res)=>{
    try {
        const{email,password,passwordVertif} = req.body
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (email.trim() ==="")
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
        const passwordHas = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,passwordHas
        })

        const savedUser = await newUser.save();

    } catch (error) {
        console.error(error);
        res.status(500).send()
    }
})

module.exports = router;