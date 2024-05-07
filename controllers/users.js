const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs/dist/bcrypt');

// Method to return all users
exports.getAll = async (req, res) => {
    try {
        const response = await prisma.users.findMany();
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// Method to return all users
exports.getAllManagers = async (req, res) => {
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
        const updatedUser = await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                email: email,
                password: bcrypt.hashSync(password, 8),
                user_type_id: userType.id,
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Method to delete a user
exports.delete = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.users.delete({
            where: {
                id: id,
            },
        });

        res.status(200).send("User deleted successfully");
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};