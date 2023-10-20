import express, { query } from "express";
import { verifyTokenAdmin } from "../middleware/AuthToken.js";
import Product from "../models/Product.js";

const router = express.Router();

//create
router.post('/', verifyTokenAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update-Actualizar usuarios
router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});
// //delete
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Producto Eliminado...");
    } catch (error) {
        res.status(500).json(error);
    }
})

// //get
router.get("/buscar/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});


//get all products
router.get("/", async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try {
        let products;
        if(queryNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if (queryCategory){
            products = await Product.find({categories: {
                $in: [queryCategory]
            }});
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
});


export default router;