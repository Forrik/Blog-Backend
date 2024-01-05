import express from 'express';
import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation
} from './validations.js';
import checkAuth from './utils/checkAuth.js';
import {
    register,
    login,
    getMe
} from './controllers/UserController.js';

import {
    create,
    getAll,
    getOne,
    remove,
    update
} from './controllers/PostController.js';

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.vksn84v.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Подключение к базе данных успешно выполнено!'))
    .catch((err) => console.log('Произошла ошибка', err));

const app = express();


app.use(express.json());

app.post('/auth/login', loginValidation, login)

app.post('/auth/register', registerValidation, register)

app.get('/auth/me', checkAuth, getMe)

app.post('/posts', checkAuth, postCreateValidation, create);

app.get('/posts', getAll);

app.get('/posts/:id', getOne)

app.delete('/posts/:id', checkAuth, remove)

app.patch('/posts/:id', checkAuth, postCreateValidation, update)


app.listen(4444, (err) => {
    if (err) {
        return console.log('Произошла ошибка', err);
    }
    console.log('Сервер запущен на порту 3000');
});