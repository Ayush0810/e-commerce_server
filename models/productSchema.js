import mongoose from "mongoose";

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a product name"],
			trim: true,
			maxLength: [120, "Product name should be less than 120 characters"],
		},
	},
	{
		price: {
			type: String,
			required: [true, "Please provide a product price"],
			maxLength: [5, "Product price should be less than 5 digits"],
		},
	},
	{
		description: {
			type: String,
		},
	},
	{
		photos: [
			{
				secure_url: {
					type: String,
					required: true,
				},
			},
		],
        stock:{
            type:Number,
            default:0
        },
        sold:{
            type:Number,
            default:0
        },
        collectionId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Collection'
        },
        
	},

	{
		timestamps: true,
	}
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
