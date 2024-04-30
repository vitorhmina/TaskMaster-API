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
    const { name, description, start_date, end_date } = req.body;
    try {
        const project = await prisma.projects.create({
            data: {
                name: name,
                description: description,
                start_date: start_date,
                end_date: end_date,
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
    const id = parseInt(req.params.id);
    const { name, description, start_date, end_date } = req.body;

    try {
        const updatedProject = await prisma.projects.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                description: description,
                start_date: start_date,
                end_date: end_date,
            },
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ msg: error.message });
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
