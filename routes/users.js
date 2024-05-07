const userRouter = require('express').Router();
const controller = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const authorizeUserTypes = require('../middlewares/authorizeUserTypes');

//use auth middleware
userRouter.use(authMiddleware);

//projects CRUD
userRouter.get('/', controller.getAll); //read all
userRouter.get('/:id', controller.getById); //read one by his id

// Routes restricted to admin users
userRouter.get('/managers', authorizeUserTypes([1]), controller.getAllManagers);
userRouter.post('/create', authorizeUserTypes([1]), controller.create); // Create new user
userRouter.put('/update/:id', authorizeUserTypes([1]), controller.update); // Update user
userRouter.delete('/delete/:id', authorizeUserTypes([1]), controller.delete); // Delete user

module.exports = userRouter;