const { body } = require('express-validator');

const validateCollectorsRules = [
  body('nick', 'Nick has to length at least 4 charaters').exists().isLength({min: 4}),
  body('nick', 'Nick max length is 8 characters').exists().isLength({max: 8}),
  body('email', 'Incorrect mail').exists().isEmail(),
  body('name', 'Name max length is 42 charaters').exists().isLength({max: 42}),
  body('last_name', 'Last Name max length is 42 charaters').exists().isLength({max: 36}),
  body('phone', 'Phones max length is 20 characters').exists().isLength({max: 20})
]

module.exports = validateCollectorsRules;