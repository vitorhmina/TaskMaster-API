const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Method to retrieve all tasks associated with a project
exports.getTasksByProjectId = async (req, res) => {
    const projectId = parseInt(req.params.id);

    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                project_id: projectId,
            },
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// Return task by id
exports.getById = async (req, res) => {
    // Get task id requested
    const id = parseInt(req.params.id);
    try {
        // Find task by id
        const response = await prisma.tasks.findUnique({
            where: {
                id: id,
            },
        })
        // Return task
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        // Extract task data from request body
        const { name, description, start_date, scheduled_end_date, status, project_id } = req.body;

        // Create the task using Prisma
        const createdTask = await prisma.tasks.create({
            data: {
                name,
                description,
                start_date,
                scheduled_end_date,
                status,
                project_id
            },
        });

        // Send success response
        res.status(201).json({ message: 'Task created successfully', task: createdTask });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
};

// Method to update a task
exports.update = async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { name, description, start_date, scheduled_end_date, status, project_id } = req.body;

    try {
        // Check if the task exists
        const existingTask = await prisma.tasks.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!existingTask) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Update the task
        const updatedTask = await prisma.tasks.update({
            where: {
                id: taskId,
            },
            data: {
                name: name || existingTask.name,
                description: description || existingTask.description,
                start_date: start_date || existingTask.start_date,
                scheduled_end_date: scheduled_end_date || existingTask.scheduled_end_date,
                status: status || existingTask.status,
                project_id: project_id || existingTask.project_id,
            },
        });

        // Send success response
        res.status(200).json(updatedTask)
    } catch (error) {
        // Handle errors
        res.status(400).json({ msg: error.message })
    }
};

// Method to delete a task by ID
exports.delete = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        // Check if the task exists
        const existingTask = await prisma.tasks.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!existingTask) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Delete the task
        await prisma.tasks.delete({
            where: {
                id: taskId,
            },
        });

        // Send success response
        res.status(200).json({ msg: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
};
