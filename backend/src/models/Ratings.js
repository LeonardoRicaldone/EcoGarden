/*
    Campos:
        comment
        score
        idProduct
        idClient
*/

import { Schema, model } from "mongoose";

const ratingsSchema = new Schema({
    comment: {
        type: String,
        require: true
    },
    score: {
        type: Number,
        require: true,
        max: 5,
    },
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        require: true
    },
    idClient: {
        type: Schema.Types.ObjectId,
        ref: "Clients",
        require: true
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Ratings", ratingsSchema)