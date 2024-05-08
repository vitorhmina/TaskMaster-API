const userTasksRouter = require('express').Router();
const controller = require('../controllers/user_tasks');
const authMiddleware = require('../middlewares/auth');
const authorizeUserTypes = require('../middlewares/authorizeUserTypes');
const isAssignedToTask = require('../middlewares/isAssignedToTask');
const isManagerToProject = require('../middlewares/isManagerToProject');

//use auth middleware
userTasksRouter.use(authMiddleware);

//projects CRUD
userTasksRouter.get('/getTaskUsers/:id', controller.getTaskUsers); // get all users assigned to a task
userTasksRouter.get('/getUserTasks/:id', controller.getUserTasks); // get all tasks a user is assigned to
userTasksRouter.get('/:id', controller.getById); // get a user assignement to a task by id
userTasksRouter.post('/create', isManagerToProject , controller.create); // assign a user to a task
userTasksRouter.put('/update/:id', isAssignedToTask, controller.update); // update a user task assignement
userTasksRouter.delete('/delete/:id', isManagerToProject, controller.delete); // unassign a user from a task

module.exports = userTasksRouter;