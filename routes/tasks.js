const taskRouter = require('express').Router();
const controller = require('../controllers/tasks');
const authMiddleware = require('../middlewares/auth');
const authorizeUserTypes = require('../middlewares/authorizeUserTypes');
const isManagerToProject = require('../middlewares/isManagerToProject');

//use auth middleware
taskRouter.use(authMiddleware);

// Tasks CRUD
taskRouter.get('/getProjectTasks/:id', controller.getTasksByProjectId); // get all tasks of a project
taskRouter.get('/:id', controller.getById); // get task by id
taskRouter.post('/create', isManagerToProject, controller.create); // create a new task
taskRouter.put('/update/:id', isManagerToProject, controller.update); // update a task
taskRouter.delete('/delete/:id', isManagerToProject, controller.delete); // delete a task

module.exports = taskRouter;