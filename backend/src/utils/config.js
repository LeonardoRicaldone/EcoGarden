import dotenv from "dotenv";


//me ayudara a acceder al .env
dotenv.config();

export const config = {
    db: {
        URI: process.env.DB_URI || "mongodb+srv://DevLeonardo:wMyIP08maSsm3JWT@ecogardendb.tobim.mongodb.net/EcoGardenDB?retryWrites=true&w=majority&appName=EcoGardenDB",
    },
    server: {
        port: process.env.PORT || 4000,
    },
    JWT: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES,
    },
    ADMIN: {
        emailAdmin: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    },
    email: {
        email_user: process.env.EMAIL_USER,
        email_pass: process.env.EMAIL_PASS,
    },
    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};