import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please Provide a category"],
			trim: true, 
			maxLength: [
				120,
				"Collection name should not be more than 120 characters",
			],
		},
	},
	{
		timestamps: true,
	}
);

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
