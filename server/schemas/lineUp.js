import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lineUpSchema = new Schema({

	userId: {type: String, required: true},
	groups: {type: [Object], default: []}
})

export default mongoose.model("LineUp", lineUpSchema, "line_ups");