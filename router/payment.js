import express from "express";
import Stripe from "stripe";
const router = express.Router();

router.post("/payment", (req, res)=> {
    Stripe(process.env.STRIPE_KEY).charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, (stripeError, stripeResponse) => {
        if(stripeError){
            res.status(500).json(stripeError);
        }else{
            res.status(200).json(stripeResponse);
        }
    })
})

export default router;