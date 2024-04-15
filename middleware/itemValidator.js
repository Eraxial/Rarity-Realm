const { body } = require('express-validator')

const itemValidator = [
  body('item_name', "Name can't be empty").notEmpty(),
  body('item_name', "Name can't length more than 50 characters").isLength({max: 50}),
  body('item_purchaseyear', 'Purchase year hast to be a number of 4 characters').isLength({min: 4, max: 4}),
  body('item_description', "Description can't length more than 255 characters").isLength({max: 255}),
  body('collection_id', 'You have to choose a collection').notEmpty(),
  body('category_id', 'You have to choose a category').notEmpty()
]

module.exports = itemValidator;