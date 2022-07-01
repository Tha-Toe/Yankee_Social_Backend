const router = require("express").Router();
const bcrypt = require("bcrypt");
const {User} = require("../models/model")

router.post("/",async (req,res) => {
    try {
        const user = await User.findOne({tokens: req.body.token});
        if(!user)
            return res.status(404).send({message: "User with given token no exist!"});
        
//        const dbToken = user.generateAuthToken();
        if(!user.tokens === req.body.token) {
            return res.status(401).send({message: "Invalid token"});
        }else {
            res.status(200).send({userData: user, message: "Log In successfully"});  
        }
/*
        const validateToken = await bcrypt.compare(
            req.body.token,user.tokens
        )
        console.log(validateToken);

        if(!validateToken)
            return res.status(401).send({message: "Invalid token"});
        const email = user.email;
        return res.status(200).send({emailData: email, message: "Log In successfully"});      
*/        
    } catch (error) {
        if(error)
        console.log(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
})

module.exports = router;