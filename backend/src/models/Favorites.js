import { Schema, model } from "mongoose";

const favoritesSchema = new Schema(
    {
        idProduct: {
            type: Schema.Types.ObjectId,
            ref: "Products", // IMPORTANTE: Debe coincidir EXACTAMENTE con el nombre del modelo
            required: true  // CORREGIDO: era "require"
        },
        idClient: {
            type: Schema.Types.ObjectId,
            ref: "Clients",  // IMPORTANTE: Debe coincidir EXACTAMENTE con el nombre del modelo
            required: true   // CORREGIDO: era "require"
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Favorites", favoritesSchema);