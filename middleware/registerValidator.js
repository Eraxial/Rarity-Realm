const { body } = require('express-validator');

const validateCollectorsRules = [
  body('nick', 'Nick has to length at least 4 charaters').exists().isLength({min: 4}),
  body('nick', 'Nick max length is 8 characters').exists().isLength({max: 8}),
  body('email', 'Incorrect mail').exists().isEmail(),
  body('password', 'Invalid password').exists().custom(value=>{
    if(!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(value)){
        throw new Error('Password must contain a capital letter, a lower case, a number and length 8 at least characters')
    }
    return true
  })

]

module.exports = validateCollectorsRules;