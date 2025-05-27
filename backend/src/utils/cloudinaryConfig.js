import {config} from "./config.js";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

export default cloudinary;

