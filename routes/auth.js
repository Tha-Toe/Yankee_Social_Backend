const router = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const {User} = require("../models/model");

router.post("/",async (req,res)=>{
    try {
        const {error} = await validate(req.body);
        if(error)
            return res.status(400).send({message: error.details[0].message});
        
        const user = await User.findOne({email: req.body.email});
        if(!user) 
            return res.status(401).send({message: "Invalid email"});
        
        const validatePassword = await bcrypt.compare(
            req.body.password,user.password
        )
        if(!validatePassword)
            return res.status(401).send({message: "Invalid password"});

        const token = user.tokens;
//        const token = await user.generateAuthToken().concat();
        return res.status(200).send({data: token, message: "Log In successfully"});      
    } catch (error) {
        if(error)
            console.log(error);
            return res.status(500).send({message: "Internal Server Error"});
    }
})

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    })
    return schema.validate(data)
}

module.exports = router;