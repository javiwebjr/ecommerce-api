import express from "express";
import { verifyTokenAuthorization, verifyToken, verifyTokenAdmin } from "../middleware/AuthToken.js";
import User from "../models/User.js";

const router = express.Router();

//Update-Actualizar usuarios
router.put('/:id', verifyTokenAuthorization, async (req, res) => {
    if(req.body.password){
        req.body.password= CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});
//delete
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Usuario Eliminado...");
    } catch (error) {
        res.status(500).json(error);
    }
})

//get
router.get("/buscar/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get all users
router.get("/", verifyTokenAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

//user stats
router.get("/status", verifyTokenAdmin, async(req, res)=> {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            {
                $match: {createdAt: {$gte: lastYear}}
            },
            {
                $project: {
                    month: {$month: "$createdAt"}
                }
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;