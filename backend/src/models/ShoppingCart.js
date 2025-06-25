import { Schema, model } from "mongoose";

const shoppingCartSchema = new Schema(
    {
        idClient: {
            type: Schema.Types.ObjectId,
            ref: "Clients", // Referencia a la colección de clientes
            required: true  // CORREGIDO: era "require"
        },
        products: [
            {
                idProduct: {
                    type: Schema.Types.ObjectId,
                    ref: "Products", // Referencia a la colección de productos
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true, // CORREGIDO: agregado required
                    min: 1, // Cantidad mínima
                },
                subtotal: {
                    type: Number,
                    required: true,
                    min: 0
                },
            },
        ],
        total: {
            type: Number,
            required: true,
            min: 0,
            default: 0 // AGREGADO: valor por defecto
        },
        status: {
            type: String,
            enum: {
                values: ["Pending", "Paid"],
                message: "El estado del pedido debe ser 'Pending' o 'Paid'",
            },
            default: "Pending",
        },
    },
    {
        timestamps: true,
        strict: false
    }
);

shoppingCartSchema.pre('save', function(next) {
    if (this.products && this.products.length > 0) {
        this.total = this.products.reduce((sum, product) => sum + product.subtotal, 0);
    } else {
        this.total = 0;
    }
    next();
});

export default model("ShoppingCart", shoppingCartSchema)