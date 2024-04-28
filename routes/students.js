const studentRouter = require('express').Router();
const controller = require('../controllers/students');
const authMiddleware = require('../middlewares/auth');

//use auth middleware
studentRouter.use(authMiddleware);

//students CRUD
studentRouter.get('/', controller.getAll); //read all
studentRouter.get('/:number', controller.getById); //read one by his id (student number)
studentRouter.post('/create', controller.create); //create new student
studentRouter.put('/update', controller.update); //update student
studentRouter.delete('/delete/:number', controller.delete); //delete student

module.exports = studentRouter;