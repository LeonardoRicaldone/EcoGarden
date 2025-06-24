import jsonwebtoken from "jsonwebtoken"
import { config } from "../utils/config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
    return (req, res, next) => {
        try {
            // 1. Intentar obtener token de cookies primero
            let token = req.cookies?.authToken;
            
            // 2. Si no hay cookie, intentar header Authorization
            if (!token) {
                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    token = authHeader.substring(7);
                }
            }

            // 3. Si no existe el token en ningún lado
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No auth token found, you must log in"
                });
            }

            // 4. Verificar y decodificar el token
            const decoded = jsonwebtoken.verify(token, config.JWT.secret);

            // 5. Verificar si el rol puede ingresar o no
            if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied - insufficient permissions"
                });
            }

            // 6. Agregar la información del usuario decodificada a req
            req.user = {
                id: decoded.id,
                userType: decoded.userType
            };

            // 7. Continuar con el siguiente middleware
            next();

        } catch (error) {
            console.log("Token validation error:", error.message);
            
            // Manejo específico de errores de JWT
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token has expired, please log in again"
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }
            
            // Error genérico
            return res.status(500).json({
                success: false,
                message: "Server error during token validation"
            });
        }
    }
}