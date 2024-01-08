import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/User.js';

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new userModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save();

        const token = jwt.sign({

            _id: user._id,
        }, 'secret123', {
            expiresIn: '30d'
        }, )

        const {
            passwordHash,
            ...userData
        } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {

        const user = await userModel.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPassword) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({

                _id: user._id,
            },
            'secret123', {
                expiresIn: '30d'
            }
        )

        const {
            passwordHash,
            ...userData
        } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })

    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }





        const {
            passwordHash,
            ...userData
        } = user._doc;

        res.json(userData)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}

export const updateUser = async (req, res) => {
    try {

        const {
            fullName,
            avatarUrl,
            newPassword
        } = req.body;

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);
            user.passwordHash = newPassword;
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (avatarUrl) {
            user.avatarUrl = avatarUrl;
        }

        const updatedUser = await user.save();

        res.json({

            message: 'Профиль обновлен',
            user: {
                ...updatedUser._doc,
                passwordHash: ''
            }
        })

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Не удалось обновить профиль'
        })
    }

}

export const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.id; // предположим, что ID передается через параметры запроса

        const user = await userModel.findByIdAndDelete(userIdToDelete);

        console.log(`Удален профиль пользователя: ${user?.username}, ID: ${user?._id}`);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        res.json({
            message: 'Профиль успешно удален',
            deletedUser: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить профиль',
        });
    }
};


export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пользователей'
        })
    }
}