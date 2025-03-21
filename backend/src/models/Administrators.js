/*
    Campos:
        name
        lastname
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
        lastname: {
            type: String,
        },
        phone: {
            type: String,
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