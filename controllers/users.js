const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs/dist/bcrypt');

// Method to return all users
exports.getAll = async (req, res) => {
    try {
        const response = await prisma.users.findMany({
            include: {
                user_types: {
                    select: {
                        user_type: true
                    }
                }
            }
        });

        const transformedResponse = response.map(user => ({
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            photo: user.photo,
            user_type: user.user_types.user_type
        }));

        res.status(200).json(transformedResponse);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// Method to return all project managers
exports.getManagers = async (req, res) => {
    try {
        const response = await prisma.users.findMany({
            where: {
                user_type_id: 2,
            },
        });
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// Method to return a user by its id
exports.getById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const response = await prisma.users.findUnique({
            where: {
                id: id,
            },
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

// Method to create a user
exports.create = async (req, res) => {
    const { name, email, password, user_type } = req.body;

    const userType = await prisma.user_types.findUnique({
        where: {
            user_type: user_type
        }
    });

    if (!userType) {
        return res.status(404).json({ msg: "User type not found" });
    }

    try {
        const newUser = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 8),
                user_type_id: userType.id
            },
        })
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// Method to update a user
exports.update = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, password, photo, user_type } = req.body;

    try {
        // Check if the user exists
        const existingUser = await prisma.users.findUnique({
            where: {
                id: id,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if the user type exists
        const userType = await prisma.user_types.findUnique({
            where: {
                user_type: user_type,
            },
        });

        if (!userType) {
            return res.status(404).json({ msg: "User type not found" });
        }

        // Update the user
        const updatedUser = await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                name: name || existingUser.name,
                email: email || existingUser.email,
                password: password ? bcrypt.hashSync(password, 8) : existingUser.password,
                photo: photo || existingUser.photo,
                user_type_id: userType.id,
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.delete = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.$transaction([
            prisma.user_projects.deleteMany({
                where: {
                    user_id: id,
                },
            }),
            prisma.user_tasks.deleteMany({
                where: {
                    user_id: id,
                },
            }),
            prisma.users.delete({
                where: {
                    id: id,
                },
            }),
        ]);

        res.status(200).send("User deleted successfully");
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
