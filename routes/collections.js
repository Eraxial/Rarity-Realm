const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionController')

router.get('/', controller.showCollections)

router.get('/:id', controller.showOneCollection)

module.exports = router;