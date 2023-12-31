import express, { query } from "express";
import { verifyTokenAuthorization, verifyToken, verifyTokenAdmin } from "../middleware/AuthToken.js";
import Order from "../models/Order.js";

const router = express.Router();

//create
router.post('/', verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update-Actualizar usuarios
router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});
// //delete
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Orden Eliminada...");
    } catch (error) {
        res.status(500).json(error);
    }
})

//get cart
router.get("/buscar/:userId", verifyTokenAuthorization, async (req, res) => {
    try {
        const orders = await Order.findOne({userId: req.params.userId});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});


//get all 

router.get("/", verifyTokenAdmin, async (req, res)=> {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
})


//Get monthly

router.get("/ingreso", verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: {$gte: previousMonth}
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"},
                },
            },
        ]);
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
})


export default router;