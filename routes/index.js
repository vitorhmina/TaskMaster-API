const router = require('express').Router();
const authRouter = require('./auth');
const projectRouter = require('./projects');
const userRouter = require('./users');
const userProjectsRouter = require('./user_projects');
const taskRouter = require('./tasks');
const userTasksRouter = require('./user_tasks');
const observationRouter = require('./observations')

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/users', userRouter);
router.use('/user_projects', userProjectsRouter);
router.use('/tasks', taskRouter)
router.use('/user_tasks', userTasksRouter);
router.use('/observations', observationRouter)

module.exports = router;