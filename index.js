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
    getMe,
    updateUser,
    deleteUser,
    getUsers
} from './controllers/UserController.js';

import {
    create,
    getAll,
    getOne,
    remove,
    update,
    getLastTags
} from './controllers/PostController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import cors from 'cors'

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.vksn84v.mongodb.net/?retryWrites=true&w=majority')
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
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', getLastTags)

app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.get('/auth/me', checkAuth, getMe)
app.patch('/auth/me', checkAuth, upload.single('image'), handleValidationErrors, updateUser)
app.delete('/user/:id', checkAuth, deleteUser)
app.get('/users', getUsers)

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create);
app.get('/posts', getAll);
app.get('/posts/:id', getOne)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)


app.listen(4444, (err) => {
    if (err) {
        return console.log('Произошла ошибка', err);
    }
    console.log('Сервер запущен на порту 4444');
});