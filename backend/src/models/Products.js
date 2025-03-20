/*
   Campos:
       name
       description
       price
       stock
       imgProduct
       idCategory
*/

import { Schema, model } from "mongoose";

const productsSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    descripcion: {
        type: String
    },
    price: {
        type: Number,
        require: true,
        min: 0
    },
    stock: {
        type: Number,
        require: true,
        min: 0
    },
    imgProduct: {
        type: String,
        require: true
    },
    idCategory: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        require: true
    }
}, 
{
    timestamps: true,
    strict: false
});

export default model("Products", productsSchema)
