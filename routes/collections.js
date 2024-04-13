const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionController')

router.get('/', controller.showCollection)

module.exports = router;