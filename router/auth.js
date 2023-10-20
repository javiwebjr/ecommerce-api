import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post('/registro', async (req ,res)=> {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString()
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }

});

router.post("/login", async (req ,res)=> {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) return res.status(401).json("Credenciales Incorrectas");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
        const pass = hashedPassword.toString(CryptoJS.enc.Utf8);
        if(pass !== req.body.password)return res.status(401).json("Password Incorrecto");

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET,{
            expiresIn: "1d"
        });

        const {password, ...others} = user._doc;
        res.status(200).json({...others, accessToken});
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;