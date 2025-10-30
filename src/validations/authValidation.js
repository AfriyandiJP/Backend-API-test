const Joi = require('joi');

// Registration validation schema
const registrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email format is invalid',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
  first_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'First name is required',
      'string.max': 'First name must not exceed 100 characters',
      'any.required': 'First name is required'
    }),
  last_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name must not exceed 100 characters',
      'any.required': 'Last name is required'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email format is invalid',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Profile update validation schema
const profileUpdateSchema = Joi.object({
  first_name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'First name cannot be empty',
      'string.max': 'First name must not exceed 100 characters'
    }),
  last_name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Last name cannot be empty',
      'string.max': 'Last name must not exceed 100 characters'
    })
});

module.exports = {
  registrationSchema,
  loginSchema,
  profileUpdateSchema
};
