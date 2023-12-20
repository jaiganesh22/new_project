import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
            text: true,
        },
        price: {
            type: Number,
            required: true,
            text: true,
        },
        description: {
            type: String,
            required: true,
            text: true,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        sold: {
            type: Boolean,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        }
    }
)

export default mongoose.model("items", itemsSchema);