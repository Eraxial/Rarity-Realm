const { body } = require('express-validator');

const LoginValidator = [
  body('email', 'Invalid email').exists().isEmail(),
  body('password', 'Invalid password').notEmpty()
]

module.exports = LoginValidator;