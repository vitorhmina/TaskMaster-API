const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if user is assigned to a task
const isAssignedToTask = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;

        // Check if the user is assigned to a task
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            },
            include: {
                user_tasks: {
                    where: {
                        task_id: taskId
                    }
                }
            }
        });

        if (!user || !user.user_tasks.length) {
            // User is not assigned to this task
            return res.status(403).json({ msg: 'You are not assigned to this task' });
        }

        // User is assigned to this task
        req.isAssignedToTask = true;
        next();
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

module.exports = isAssignedToTask;
