const Joi = require('joi');

const incomeSchema = Joi.object({
  title:       Joi.string().min(1).max(200).required().messages({ 'any.required': 'Sarlavha kiritilishi shart' }),
  amount:      Joi.number().positive().required().messages({ 'any.required': 'Miqdor kiritilishi shart', 'number.positive': 'Miqdor musbat bo\'lishi kerak' }),
  category:    Joi.string().required().messages({ 'any.required': 'Kategoriya kiritilishi shart' }),
  date:        Joi.string().isoDate().required().messages({ 'any.required': 'Sana kiritilishi shart' }),
  description: Joi.string().max(500).allow('', null).optional(),
});

const expenseSchema = Joi.object({
  title:       Joi.string().min(1).max(200).required().messages({ 'any.required': 'Sarlavha kiritilishi shart' }),
  amount:      Joi.number().positive().required().messages({ 'any.required': 'Miqdor kiritilishi shart', 'number.positive': 'Miqdor musbat bo\'lishi kerak' }),
  category:    Joi.string().required().messages({ 'any.required': 'Kategoriya kiritilishi shart' }),
  date:        Joi.string().isoDate().required().messages({ 'any.required': 'Sana kiritilishi shart' }),
  description: Joi.string().max(500).allow('', null).optional(),
});

module.exports = { incomeSchema, expenseSchema };
