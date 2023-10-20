import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./router/user.js";
import authRouter from "./router/auth.js";
import productRouter from "./router/product.js";
import cartRouter from "./router/cart.js";
import orderRouter from "./router/order.js";
import paymentRouter from "./router/payment.js";
import cors from "cors";
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected succesfully"))
    .catch(error => console.log(error));



const dominios = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(dominios.indexOf(origin)!== -1){
            callback(null, true)
        }else{
            callback(new Error ('No permitido por Cors'))
        }
    }
}
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/productos", productRouter);
app.use("/api/carritos", cartRouter);
app.use("/api/ordenes", orderRouter);
app.use("/api/checkout", paymentRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Backend running on port: 4000")
})