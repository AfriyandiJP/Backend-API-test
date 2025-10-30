const Joi = require('joi');

// Top-up validation schema
const topUpSchema = Joi.object({
  top_up_amount: Joi.number()
    .integer()
    .positive()
    .min(10000) // Minimum top-up 10,000
    .max(10000000) // Maximum top-up 10,000,000
    .required()
    .messages({
      'number.base': 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      'number.integer': 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      'number.positive': 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      'number.min': 'Minimum jumlah top up adalah 10,000',
      'number.max': 'Maximum jumlah top up adalah 10,000,000',
      'any.required': 'Jumlah top up harus diisi'
    })
});

// Transaction/Payment validation schema
const transactionSchema = Joi.object({
  service_code: Joi.string()
    .required()
    .messages({
      'string.base': 'Kode layanan harus berupa string',
      'any.required': 'Kode layanan harus diisi'
    })
});

// Transaction history validation schema (query params)
const transactionHistorySchema = Joi.object({
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Offset harus berupa angka',
      'number.integer': 'Offset harus berupa angka',
      'number.min': 'Offset harus lebih dari 0'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit harus berupa angka',
      'number.integer': 'Limit harus berupa angka',
      'number.min': 'Limit harus lebih dari 1',
      'number.max': 'Limit harus kurang dari 100'
    })
});

module.exports = {
  topUpSchema,
  transactionSchema,
  transactionHistorySchema
};
