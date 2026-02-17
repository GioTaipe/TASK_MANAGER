const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');// Aplicamos el middleware de autenticación a todas las rutas de tareas router.use(authMiddleware);


router.get('/', authMiddleware ,taskController.getTasks); // Obtener todas las tareas del usuario autenticado
router.post('/', authMiddleware ,taskController.createTask); // Crear una nueva tarea para el usuario autenticado
router.patch('/:id', authMiddleware,taskController.updateTask); // Actualizar una tarea específica por su ID (solo el título o la descripción)
router.post('/:id/start', authMiddleware ,taskController.startTask); // Marcar una tarea como iniciada (cambiar su estado a "in progress")
router.post('/:id/stop', authMiddleware ,taskController.stopTask); // Detener una tarea (cambiar su estado a "completed")
router.delete('/:id', authMiddleware ,taskController.deleteTask); // Eliminar una tarea específica por su ID
router.get('/stats', authMiddleware, taskController.getStats); // Obtener estadísticas de tareas para el usuario autenticado (número total de tareas, tareas completadas y tiempo total dedicado a tareas completadas)

module.exports = router;