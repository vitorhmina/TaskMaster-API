const userProjectsRouter = require('express').Router();
const controller = require('../controllers/user_projects');
const authMiddleware = require('../middlewares/auth');
const authorizeUserTypes = require('../middlewares/authorizeUserTypes');
const isManagerToProject = require('../middlewares/isManagerToProject');

//use auth middleware
userProjectsRouter.use(authMiddleware);

//projects CRUD
userProjectsRouter.get('/getProjectUsers/:id', controller.getProjectUsers); // get all users assigned to a project
userProjectsRouter.get('/getUserProjects/:id', controller.getUserProjects); // get all projects a user is assigned to
userProjectsRouter.get('/:id', controller.getById); // get a user assignement to a project by id
userProjectsRouter.post('/create', isManagerToProject , controller.create); // assign a user to a project
userProjectsRouter.put('/update/:id', isManagerToProject, controller.update); // update a user project assignement
userProjectsRouter.delete('/delete/:id', isManagerToProject, controller.delete); // unassign a user from a project

module.exports = userProjectsRouter;