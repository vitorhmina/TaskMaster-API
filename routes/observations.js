const observationRouter = require('express').Router();
const controller = require('../controllers/observations');
const authMiddleware = require('../middlewares/auth');
const authorizeUserTypes = require('../middlewares/authorizeUserTypes');
const isAssignedToTask = require('../middlewares/isAssignedToTask');
const isManagerToProject = require('../middlewares/isManagerToProject');

//use auth middleware
observationRouter.use(authMiddleware);

//projects CRUD
observationRouter.get('/getTaskObservations/:id', controller.getTaskObservations); // get all observations
observationRouter.get('/:id', controller.getById); // get observation by id
observationRouter.post('/create', isAssignedToTask, controller.create); // Create new observation
observationRouter.put('/update/:id', isAssignedToTask, controller.update); // Update observation
observationRouter.delete('/delete/:id', isManagerToProject, controller.delete); // Delete observation

module.exports = observationRouter;