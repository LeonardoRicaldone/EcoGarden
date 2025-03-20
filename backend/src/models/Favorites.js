/*
    Campos:
    idProduct
        idClient
*/

import { Schema, model } from "mongoose";

const favoritesSchema = new Schema(
    {
        idProduct: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            require: true
        },
        idClient: {
            type: Schema.Types.ObjectId,
            ref: "Clients",
            require: true
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Favorites", favoritesSchema);