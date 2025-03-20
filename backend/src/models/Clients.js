/*
   Campos:
       name
       lastname
       telephone
       email
       password
*/

import { Schema, model } from "mongoose";

const clientsSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    telephone: {
        type: Number,
        require: true,
        min: 0
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, 
{
    timestamps: true,
    strict: false
});

export default model("Clients", clientsSchema)