const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak',
    'any.required': 'To\'liq ism kiritilishi shart',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email formati noto\'g\'ri',
    'any.required': 'Email kiritilishi shart',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
    'any.required': 'Parol kiritilishi shart',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email formati noto\'g\'ri',
    'any.required': 'Email kiritilishi shart',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Parol kiritilishi shart',
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Joriy parol kiritilishi shart',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak',
    'any.required': 'Yangi parol kiritilishi shart',
  }),
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };
