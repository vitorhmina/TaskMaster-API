const router = require('express').Router();
const authRouter = require('./auth');
const studentRouter = require('./students');
const projectRouter = require('./projects');
const userRouter = require('./users');
const userProjectsRouter = require('./user_projects');
const taskRouter = require('./tasks');


router.use('/auth', authRouter);
router.use('/students', studentRouter);
router.use('/projects', projectRouter);
router.use('/users', userRouter);
router.use('/user_projects', userProjectsRouter);
router.use('/tasks', taskRouter)

module.exports = router;