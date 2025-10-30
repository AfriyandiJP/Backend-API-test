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
      'number.base': 'Top up amount must be a number',
      'number.integer': 'Top up amount must be an integer',
      'number.positive': 'Top up amount must be positive',
      'number.min': 'Minimum top up amount is 10,000',
      'number.max': 'Maximum top up amount is 10,000,000',
      'any.required': 'Top up amount is required'
    })
});

// Transaction/Payment validation schema
const transactionSchema = Joi.object({
  service_code: Joi.string()
    .required()
    .messages({
      'string.base': 'Service code must be a string',
      'any.required': 'Service code is required'
    })
});

// Transaction history validation schema (query params)
const transactionHistorySchema = Joi.object({
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Offset must be a number',
      'number.integer': 'Offset must be an integer',
      'number.min': 'Offset must be non-negative'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
});

module.exports = {
  topUpSchema,
  transactionSchema,
  transactionHistorySchema
};
