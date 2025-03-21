/*
    Campos:
        name
        lastName
        phone
        email
        password
*/

import { Schema, model } from "mongoose";

const administratorsSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
        },
        phone: {
            type: Number,
            require: true,
        },
        email: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Administrators", administratorsSchema);