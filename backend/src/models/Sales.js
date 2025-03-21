/*
    Campos:
    idShoppingCart,
    name,
    lastname,
    phone,
    department,
    city,
    zipCode,
    address,
    creditCard,
    status
*/

import { Schema, model } from "mongoose";

const salesSchema = new Schema(
    {
        idShoppingCart: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            require: true
        },
        name: {
            type: String,
            require: true
        },
        lastname: {
            type: String

        },
        phone: {
            type: Number,
            require: true
        },
        department: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true

        },
        address: {
            type: String,
            required: true
        },
        creditCard: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Sales", salesSchema);