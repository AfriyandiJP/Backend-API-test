const Joi = require('joi');

// Registration validation schema
const registrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Parameter email tidak sesuai format',
      'any.required': 'Email tidak boleh kosong'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'password harus minimal 8 karakter',
      'any.required': 'password tidak boleh kosong'
    }),
  first_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'first name tidak boleh kosong',
      'string.max': 'first name tidak boleh melebihi 100 karakter',
      'any.required': 'first name tidak boleh kosong'
    }),
  last_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'last name tidak boleh kosong',
      'string.max': 'last name tidak boleh melebihi 100 karakter',
      'any.required': 'last name tidak boleh kosong'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'parameter email tidak sesuai format',
      'any.required': 'email tidak boleh kosong'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'password tidak boleh kosong'
    })
});

// Profile update validation schema
const profileUpdateSchema = Joi.object({
  first_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'first name tidak boleh kosong',
      'string.max': 'first name tidak boleh melebihi 100 karakter',
      'any.required': 'first name tidak boleh kosong'
    }),
  last_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'last name tidak boleh kosong',
      'string.max': 'last name tidak boleh melebihi 100 karakter',
      'any.required': 'last name tidak boleh kosong'
    })
});

module.exports = {
  registrationSchema,
  loginSchema,
  profileUpdateSchema
};
