const bcrypt = require('bcryptjs/dist/bcrypt');
const authenticateUtil = require('../utils/authenticate.js');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        })

        if (user) {
            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (passwordIsValid) {
                const accessToken = authenticateUtil.generateAccessToken({ id: user.id, name: user.name });
                res.status(200).json({ name: user.name, token: accessToken });
                return;
            }
        }

        res.status(401).json({ msg: "invalid_login" });

    } catch (error) {
        res.status(401).json({ msg: error.message })
    }
}


exports.signup = async (req, res) => {
    try {
        const { name, email, password, user_type } = req.body;

        const userType = await prisma.user_types.findUnique({
            where: {
                user_type: user_type
            }
        });

        if (!userType) {
            return res.status(404).json({ msg: "User type not found" });
        }

        const newUser = await prisma.users.create({
            data: {
                email: email,
                name: name,
                password: bcrypt.hashSync(password, 8),
                user_type_id: userType.id
            },
        });

        const accessToken = authenticateUtil.generateAccessToken({ id: newUser.id, name: newUser.name });
        res.status(200).json({ name: newUser.name, token: accessToken });

    } catch (error) {
        res.status(401).json({ msg: error.message })
    }
}