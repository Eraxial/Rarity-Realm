const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController')

router.get('/', controller.showItems);

router.get('/:id', controller.showItemInfo);

module.exports = router;