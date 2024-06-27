const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

// Method to return all projects
exports.getAll = async (req, res) => {
    try {
        const response = await prisma.projects.findMany();
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// Method to return a project by its id
exports.getById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const response = await prisma.projects.findUnique({
            where: {
                id: id,
            },
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

// Method to create a project
exports.create = async (req, res) => {
    const { name, description, start_date, planned_end_date } = req.body;
    try {
        const project = await prisma.projects.create({
            data: {
                name: name,
                description: description,
                start_date: start_date,
                planned_end_date: planned_end_date,
                status: "Active"

            },
        })
        res.status(201).json(project)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// Method to update a project
exports.update = async (req, res) => {
    const projectId = parseInt(req.params.id);
    const { name, description, start_date, planned_end_date, actual_end_date, status } = req.body;

    try {
        // Check if the project exists
        const existingProject = await prisma.projects.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!existingProject) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Update the project
        const updatedProject = await prisma.projects.update({
            where: {
                id: projectId,
            },
            data: {
                name: name || existingProject.name,
                description: description || existingProject.description,
                start_date: start_date || existingProject.start_date,
                planned_end_date: planned_end_date || existingProject.planned_end_date,
                actual_end_date: actual_end_date || existingProject.actual_end_date,
                status: status || existingProject.status,
            },
        });

        // Send success response
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
};

// Method to delete a project
exports.delete = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.projects.delete({
            where: {
                id: id,
            },
        });

        res.status(200).send("Project deleted successfully");
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
