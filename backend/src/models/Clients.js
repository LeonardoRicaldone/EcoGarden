/*
   Campos:
       name
       lastname
       telephone
       email
       password
       isVerified (nuevo campo para verificación)
*/

import { Schema, model } from "mongoose";

const clientsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    telephone: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
        trim: true,
        // Validación básica de email
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: true, 
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true,
    strict: false // Mantiene tu configuración actual
});

clientsSchema.methods.toJSON = function() {
    const client = this.toObject();
    delete client.password;
    return client;
};

export default model("Clients", clientsSchema);