import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.vksn84v.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Подключение к базе данных успешно выполнено!'))
    .catch((err) => console.log('Произошла ошибка', err));

const app = express();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Hello World!');
})

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName,
    }, 'secret', {
        expiresIn: '1h'
    });



    res.json({
        success: true,
        token
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log('Произошла ошибка', err);
    }
    console.log('Сервер запущен на порту 3000');
});