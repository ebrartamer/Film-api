const joi = require("joi");
const APIError = require("../../utils/errors");

class userValidation {
    constructor() {}
    
    register = async (req, res, next) => {
        try {
            await joi.object({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "İsim alanı metin olmalıdır",
                    "string.empty": "İsim alanı boş bırakılamaz",
                    "string.min": "İsim alanı en az 3 karakter olmalıdır",
                    "string.max": "İsim alanı en fazla 100 karakter olmalıdır",
                    "string.required": "İsim alanı zorunludur"
                }),
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "Email alanı metin olmalıdır",
                    "string.empty": "Email alanı boş bırakılamaz",
                    "string.email": "Geçerli bir email adresi giriniz",
                    "string.min": "Email alanı en az 3 karakter olmalıdır",
                    "string.max": "Email alanı en fazla 100 karakter olmalıdır",
                    "string.required": "Email alanı zorunludur"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Şifre alanı metin olmalıdır",
                    "string.empty": "Şifre alanı boş bırakılamaz",
                    "string.min": "Şifre alanı en az 6 karakter olmalıdır",
                    "string.max": "Şifre alanı en fazla 36 karakter olmalıdır",
                    "string.required": "Şifre alanı zorunludur"
                })
            }).validateAsync(req.body);
            
            next();
        } catch (error) {
            throw new APIError(error.details[0].message, 400);
        }
    }

    login = async (req, res, next) => {
        try {
            await joi.object({
               email: joi.string().email().trim().min(3).max(100).required().messages({
                "string.base": "Email alanı metin olmalıdır",
                "string.empty": "Email alanı boş bırakılamaz",
                "string.email": "Geçerli bir email adresi giriniz",
                "string.min": "Email alanı en az 3 karakter olmalıdır",
                "string.max": "Email alanı en fazla 100 karakter olmalıdır",
                "string.required": "Email alanı zorunludur"
               }),
               password: joi.string().trim().min(6).max(36).required().messages({
                "string.base": "Şifre alanı metin olmalıdır",
                "string.empty": "Şifre alanı boş bırakılamaz",
                "string.min": "Şifre alanı en az 6 karakter olmalıdır",
                "string.max": "Şifre alanı en fazla 36 karakter olmalıdır",
                "string.required": "Şifre alanı zorunludur"
               })
            }).validateAsync(req.body);

            next();
        } catch (error) {
            throw new APIError(error.details[0].message, 400);
        }
    }
}

module.exports = new userValidation();