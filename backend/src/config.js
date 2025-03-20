import dotenv from "dotenv";


//Ejecuto "Dotenv"
//me ayudara a acceder al .env
dotenv.config();

export const config = {
    db: {
        URI: process.env.DB_URI || "mongodb+srv://DevLeonardo:wMyIP08maSsm3JWT@ecogardendb.tobim.mongodb.net/?retryWrites=true&w=majority&appName=EcoGardenDB",
    },
    server: {
        port: process.env.PORT || 4000,
    }
};