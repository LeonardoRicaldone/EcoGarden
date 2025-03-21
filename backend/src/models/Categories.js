/*
    Campos:
       name
*/

import { Schema, model } from "mongoose";

const categoriesSchema = new Schema({
    name: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Categories", categoriesSchema)