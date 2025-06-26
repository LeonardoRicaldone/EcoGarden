import { Schema, model } from "mongoose";

const salesSchema = new Schema(
    {
        idShoppingCart: {
            type: Schema.Types.ObjectId,
            ref: "ShoppingCart", 
            required: true 
        },
        name: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true 
        },
        phone: {
            type: String, 
            required: true 
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
            type: String, 
            required: true
        },
        address: {
            type: String,
            required: true
        },
        creditCard: {
            type: String, 
            required: true
        },
        total: {
            type: Number,
            required: true,
            min: 0 
        },
        status: {
            type: String,
            default: "Pending",
            required: true
        }
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Sales", salesSchema);