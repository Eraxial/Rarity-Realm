const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController');

router.get('/', controller.showItems);

router.post('/filter', controller.filter);

router.get('/category/:id', controller.showCategoryItems)

router.get('/:id', controller.showItemInfo);

module.exports = router;