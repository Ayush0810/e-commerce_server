import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
	{
		code: {
			type: String,
			required: [true, "Please Provide coupon name "],
		},
		discount: {
			type: Number,
			default: 0,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	} 
);

const Coupon = mongoose.model('Coupon' , couponSchema);
module.exports = Coupon;