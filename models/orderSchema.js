import mongoose from "mongoose";
import OrderStatus from "../utils/orderStatus"
const orderSchema = mongoose.Schema({
    product:{
        type:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                count:Number,
                price:Number
            }
        ],
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    coupon:String,
    transactionId:String,
    status:{
        type:String,
        enum:Object.values(OrderStatus),
        default:OrderStatus.ORDERED
    }


},{ 
    timestamps:true
});

const Order = mongoose.model("Order" , orderSchema);
module.exports = Order;