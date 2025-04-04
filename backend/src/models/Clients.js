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
        type: String,
        require: true
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