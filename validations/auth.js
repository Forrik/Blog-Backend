import {
    body
} from "express-validator";

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