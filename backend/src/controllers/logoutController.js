const logoutController = {};

logoutController.logout = async(req, res) => {
    try {
        // Limpiar la cookie con las MISMAS opciones que se usaron para crearla
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cross-domain solo en prod
            path: '/' // Asegurar que se elimine de toda la app
        });

        // OPCIONAL: Invalidar el token en una blacklist (si tienes implementada una)
        // const token = req.cookies.authToken || req.headers.authorization?.substring(7);
        // if (token) {
        //     // Aquí podrías agregar el token a una blacklist en Redis o base de datos
        //     // await addToBlacklist(token);
        // }

        // Respuesta exitosa
        return res.json({ 
            success: true,
            message: "Session closed successfully" 
        });
        
    } catch (error) {
        console.error("Error en logout:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error closing session" 
        });
    }
};

export default logoutController;