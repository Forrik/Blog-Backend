import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {
    validationResult
} from 'express-validator';
import {
    registerValidation
} from './validations/auth.js';
import userModel from './models/User.js';


mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.vksn84v.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Подключение к базе данных успешно выполнено!'))
    .catch((err) => console.log('Произошла ошибка', err));

const app = express();


app.use(express.json());

app.post('/auth/login', async (req, res) => {
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
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'

            })
        }

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
})

app.listen(4444, (err) => {
    if (err) {
        return console.log('Произошла ошибка', err);
    }
    console.log('Сервер запущен на порту 3000');
});