import { Schema, model } from "mongoose";

const ratingsSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    idClient: {
        type: Schema.Types.ObjectId,
        ref: "Clients",
        required: true
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Ratings", ratingsSchema);