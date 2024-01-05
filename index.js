import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
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
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.vksn84v.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Подключение к базе данных успешно выполнено!'))
    .catch((err) => console.log('Произошла ошибка', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
})

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.get('/auth/me', checkAuth, getMe)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create);
app.get('/posts', getAll);
app.get('/posts/:id', getOne)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)


app.listen(4444, (err) => {
    if (err) {
        return console.log('Произошла ошибка', err);
    }
    console.log('Сервер запущен на порту 3000');
});