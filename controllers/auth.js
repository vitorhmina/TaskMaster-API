const bcrypt = require('bcryptjs/dist/bcrypt');
const authenticateUtil = require('../utils/authenticate.js');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
            include: {
                user_types: {
                    select: {
                        user_type: true
                    }
                }
            }
        });

        if (user) {
            var passwordIsValid = bcrypt.compareSync(password, user.password);

            if (passwordIsValid) {
                const accessToken = authenticateUtil.generateAccessToken({
                    id: user.id,
                    name: user.name,
                    user_type_id: user.user_type_id
                });

                res.status(200).json({
                    name: user.name,
                    token: accessToken,
                    user_id: user.id,
                    user_type: user.user_types.user_type
                });
                return;
            }
        }

        res.status(401).json({ msg: "Invalid login credentials" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    } finally {
        await prisma.$disconnect();
    }
};



exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = await prisma.users.create({
            data: {
                email: email,
                name: name,
                password: bcrypt.hashSync(password, 8),
                user_type_id: 3
            },
        });

        const accessToken = authenticateUtil.generateAccessToken({ id: newUser.id, name: newUser.name });
        res.status(200).json({ name: newUser.name, token: accessToken });

    } catch (error) {
        res.status(401).json({ msg: error.message })
    }
}