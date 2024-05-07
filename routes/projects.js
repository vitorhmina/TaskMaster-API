const projectRouter = require('express').Router();
const controller = require('../controllers/projects');
const authMiddleware = require('../middlewares/auth');
const authorizeUserTypes = require('../middlewares/authorizeUserTypes');

//use auth middleware
projectRouter.use(authMiddleware);

//projects CRUD
projectRouter.get('/', controller.getAll); // get all projects
projectRouter.get('/:id', controller.getById); // get project by id
projectRouter.post('/create',authorizeUserTypes([1]), controller.create); // Create new project
projectRouter.put('/update/:id', authorizeUserTypes([1]), controller.update); // Update project
projectRouter.delete('/delete/:id', authorizeUserTypes([1]), controller.delete); // Delete project

module.exports = projectRouter;