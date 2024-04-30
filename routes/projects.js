const projectRouter = require('express').Router();
const controller = require('../controllers/projects');
const authMiddleware = require('../middlewares/auth');

//use auth middleware
projectRouter.use(authMiddleware);

//projects CRUD
projectRouter.get('/', controller.getAll); //read all
projectRouter.get('/:id', controller.getById); //read one by his id
projectRouter.post('/create', controller.create); //create new project
projectRouter.put('/update/:id', controller.update); //update project
projectRouter.delete('/delete/:id', controller.delete); //delete project

module.exports = projectRouter;