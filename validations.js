import {
    body
} from "express-validator";

export const loginValidation = [
    body("email", "Некорректный емейл").isEmail(),
    body("password", "Пароль должен быть больше 4 символов").isLength({
        min: 5
    }),
];
export const registerValidation = [
    body("email", "Некорректный емейл").isEmail(),
    body("password", "Пароль должен быть больше 4 символов").isLength({
        min: 5
    }),
    body("fullName", "Укажите полное имя (должно быть больше 4 символов)").isLength({
        min: 5
    }),
    body("avatarUrl", "Некорректная ссылка на аватар").optional().isURL(),
];

export const postCreateValidation = [
    body("title", "Заголовок статьи не может быть пустым").isLength({
        min: 5
    }).isString(),
    body("text", "Текст статьи не может быть пустым").isLength({
        min: 5
    }).isString(),
    body("tags", "Неверный формат тегов").optional().isArray(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
]