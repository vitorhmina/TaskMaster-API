const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Method to retrieve all observations associated with a task
exports.getTaskObservations = async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
        const observations = await prisma.observations.findMany({
            where: {
                task_id: taskId,
            },
            
        });
        res.status(200).json(observations);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// Method to get an observation by its id
exports.getById = async (req, res) => {
    const observationId = parseInt(req.params.id);
    try {
        const observation = await prisma.observations.findUnique({
            where: {
                id: observationId,
            },
        });

        if (!observation) {
            return res.status(404).json({ msg: 'Observation not found' });
        }

        res.status(200).json(observation);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to create a observation
exports.create = async (req, res) => {
    const { taskId, userId, comments, photo } = req.body;

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

        // Check if the user exists
        const existingUser = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Create the new observation
        const newObservation = await prisma.observations.create({
            data: {
                task_id: taskId,
                user_id: userId,
                comments: comments,
                photo: photo,
            },
        });

        res.status(201).json(newObservation);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to update a observation
exports.update = async (req, res) => {
    const observationId = parseInt(req.params.id);
    const { comments, photo } = req.body;

    try {
        // Check if the observation exists
        const existingObservation = await prisma.observations.findUnique({
            where: {
                id: observationId,
            },
        });

        if (!existingObservation) {
            return res.status(404).json({ msg: 'Observation not found' });
        }

        // Update the observation
        const updatedObservation = await prisma.observations.update({
            where: {
                id: observationId,
            },
            data: {
                comments: comments || existingObservation.comments,
                photo: photo || existingObservation.photo,
            },
        });

        res.status(200).json(updatedObservation);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to delete an observation
exports.delete = async (req, res) => {
    const observationId = parseInt(req.params.id);

    try {
        // Check if the observation exists
        const existingObservation = await prisma.observations.findUnique({
            where: {
                id: observationId,
            },
        });

        if (!existingObservation) {
            return res.status(400).json({ msg: 'Assignment not found' });
        }

        // Delete the observation
        await prisma.observations.delete({
            where: {
                id: observationId,
            },
        });

        res.status(200).json({ msg: 'Observation deleted successfully' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};