const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Method to retrieve all users associated with a project
exports.getUsersByProjectId = async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        const userProjects = await prisma.user_projects.findMany({
            where: {
                project_id: projectId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photo: true,
                        user_type_id: true,
                        user_projects: {
                            select: {
                                role: true,
                                rating: true,
                            }
                        }
                    }
                }
            },
        });

        const users = userProjects.map((userProject) => userProject.users);
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// Method to retrieve all users associated with a project
exports.getProjectsByUserId = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const userProjects = await prisma.user_projects.findMany({
            where: {
                user_id: userId,
            },
            include: {
                projects: true,
            },
        });

        const projects = userProjects.map((userProject) => userProject.projects);
        res.status(200).json(projects);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
};

// Method to assign a user to a project
exports.create = async (req, res) => {
    const { email, projectId, role } = req.body;

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

        // Check if the user is already assigned to the project
        const existingAssignment = await prisma.user_projects.findFirst({
            where: {
                user_id: userId,
                project_id: projectId,
            },
        });

        if (existingAssignment) {
            return res.status(400).json({ message: 'User is already assigned to this project' });
        }

        // Create a new user_project entry to assign the user to the project
        const newUserProject = await prisma.user_projects.create({
            data: {
                user_id: userId,
                project_id: projectId,
                role: role,
            },
        });

        res.status(201).json(newUserProject);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to update a user's role in a project assignment
exports.update = async (req, res) => {
    const assignmentId = parseInt(req.params.id);
    const { role, rating } = req.body;

    try {
        // Check if the assignment exists
        const existingAssignment = await prisma.user_projects.findUnique({
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
                rating: rating || existingAssignment.rating,
                role: role || existingAssignment.role,
            },
        });

        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to unassign a user from a project
exports.delete = async (req, res) => {
    const assignmentId = parseInt(req.params.id);

    try {
        // Check if the assignment exists
        const existingAssignment = await prisma.user_projects.findUnique({
            where: {
                id: assignmentId,
            },
        });

        if (!existingAssignment) {
            return res.status(400).json({ msg: 'Assignment not found' });
        }

        // Delete the assignment entry to disassociate the user from the project
        await prisma.user_projects.delete({
            where: {
                id: assignmentId,
            },
        });

        res.status(200).json({ msg: 'User unassigned from project successfully' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};