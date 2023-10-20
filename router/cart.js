import express, { query } from "express";
import { verifyTokenAuthorization, verifyToken, verifyTokenAdmin } from "../middleware/AuthToken.js";
import Cart from "../models/Cart.js";

const router = express.Router();

//create
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update-Actualizar usuarios
router.put('/:id', verifyTokenAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});
// //delete
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Carrito Eliminado...");
    } catch (error) {
        res.status(500).json(error);
    }
})

//get cart
router.get("/buscar/:userId", verifyTokenAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});


//get all 

router.get("/", verifyTokenAdmin, async (req, res)=> {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})



export default router;