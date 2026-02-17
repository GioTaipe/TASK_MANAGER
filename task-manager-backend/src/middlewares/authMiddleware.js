// src/middleware/authMiddleware.js
module.exports = (req, res, next) => {
    // Buscamos el ID en los headers de la petición
    const deviceId = req.header('x-device-id');
    
    if (!deviceId) {
        return res.status(401).json({ 
            message: 'Identificación de dispositivo faltante. No puedes gestionar tareas.' 
        });
    }

    // Guardamos el ID en el objeto 'req' para que esté disponible en controladores y servicios
    req.deviceId = deviceId;
    next();
};