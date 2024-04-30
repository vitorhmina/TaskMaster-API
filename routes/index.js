const router = require('express').Router();
const authRouter = require('./auth');
const studentRouter = require('./students');
const projectRouter = require('./projects');

router.use('/auth', authRouter);
router.use('/students', studentRouter);
router.use('/projects', projectRouter);


module.exports = router;