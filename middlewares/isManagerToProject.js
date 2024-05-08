const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if user has access to the project
const isManagerToProject = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const projectId = req.body.projectId;
        console.log(projectId);

        // Check if the user is a project manager
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            },
            include: {
                user_projects: {
                    where: {
                        project_id: projectId
                    }
                }
            }
        });

        if (!user || !user.user_projects.length) {
            // User is not a project manager assigned to this project
            return res.status(403).json({ msg: 'You are not assigned as project manager of this project' });
        }

        req.isManagerToProject = true;
        next();
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

module.exports = isManagerToProject;
