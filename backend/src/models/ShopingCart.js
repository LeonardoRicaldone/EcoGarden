/*
   Campos:
       idClient
       products
         idProduct
         quantity
         subtotal
*/

import { Schema, model } from "mongoose";

const shopingCartSchema = new Schema(
    {
        idClient: {
            type: Schema.Types.ObjectId,
            ref: "Clients", //Referencia a la colección de clientes
            require: true
        },
        products: [
            {
                idProduct: {
                    type: Schema.Types.ObjectId,
                    ref: "Products", //Referencia a la colección de prodructos
                    required: true,
                },
                quantity: {
                    type: Number,
                    min: 1, //Cantidad mínima
                },
                subtotal: {
                    type: Number,
                    required: true,
                    min: 0
                },
            },
        ],
        total: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: {
                values: ["Pending", "Paid"],
                message: "El estado del pedido debe ser 'Pending' o 'Paid'",
            },
            default: "Pending",
        },
    },
    {
        timestamps: true,
        strict: false
    }
);

export default model("ShopingCart", shopingCartSchema)