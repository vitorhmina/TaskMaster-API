const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Method to retrieve all users associated with a task
exports.getTaskUsers = async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
        const userTasks = await prisma.user_tasks.findMany({
            where: {
                task_id: taskId,
            },
            include: {
                users: {
                    select: {
                        name: true,
                        user_tasks: {
                            select: {
                                id: true,
                                date: true,
                                location: true,
                                completion_rate: true,
                                time_spent: true,
                            }
                        }
                    }
                }
            },
        });

        // Extract user_projects and include the associated user's name
        const userTaskList = userTasks.flatMap((userTask) => {
            const { users } = userTask;

            return users.user_tasks.map((up) => ({
                id: up.id,
                date: up.date,
                location: up.location,
                completion_rate: up.completion_rate,
                time_spent: up.time_spent,
                name: users.name
            }));
        });

        res.status(200).json(userTaskList);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// Method to retrieve all tasks associated with a user
exports.getUserTasks = async (req, res) => {
    const userId = parseInt(req.user.id);
    try {
        const userTasks = await prisma.user_tasks.findMany({
            where: {
                user_id: userId,
            },
            include: {
                tasks: true,
            },
        });

        const tasks = userTasks.map((userTask) => userTask.tasks);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// Method to return a user_task assignement by its id
exports.getById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const response = await prisma.user_tasks.findUnique({
            where: {
                id: id,
            },
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

// Method to assign a user to a task
exports.create = async (req, res) => {
    const { email, taskId } = req.body;

    try {
        // Find the user by email to retrieve their ID
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email' });
        }

        const userId = user.id;

        // Check if the user is already assigned to the task
        const existingAssignment = await prisma.user_tasks.findFirst({
            where: {
                user_id: userId,
                task_id: taskId,
            },
        });

        if (existingAssignment) {
            return res.status(400).json({ message: 'User is already assigned to this task' });
        }

        // Create a new user_task entry to assign the user to the task
        const newUserTask = await prisma.user_tasks.create({
            data: {
                user_id: userId,
                task_id: taskId,
            },
        });

        res.status(201).json(newUserTask);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to update a user's role in a task assignment
exports.update = async (req, res) => {
    const assignmentId = parseInt(req.params.id);
    const { date, location, completion_rate, time_spent } = req.body;

    try {
        // Check if the assignment exists
        const existingAssignment = await prisma.user_tasks.findUnique({
            where: {
                id: assignmentId,
            },
        });

        if (!existingAssignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        // Update the role of the assignment
        const updatedAssignment = await prisma.user_projects.update({
            where: {
                id: assignmentId,
            },
            data: {
                date: date || existingAssignment.date,
                location: location || existingAssignment.location,
                completion_rate: completion_rate || existingAssignment.completion_rate,
                time_spent: time_spent || existingAssignment.time_spent,
            },
        });

        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to unassign a user from a task
exports.delete = async (req, res) => {
    const assignmentId = parseInt(req.params.id);

    try {
        // Check if the assignment exists
        const existingAssignment = await prisma.user_tasks.findUnique({
            where: {
                id: assignmentId,
            },
        });

        if (!existingAssignment) {
            return res.status(400).json({ msg: 'Assignment not found' });
        }

        // Delete the assignment entry to disassociate the user from the task
        await prisma.user_projects.delete({
            where: {
                id: assignmentId,
            },
        });

        res.status(200).json({ msg: 'User unassigned from task successfully' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};