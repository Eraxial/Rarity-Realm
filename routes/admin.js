const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController')
const collectorValidator = require('../middleware/collectorValidator');

router.get('/', controller.showAdminPage);

router.post('/addCategory', controller.addCategory);

router.get('/eraseCollector/:id', controller.eraseCollector);

router.get('/eraseCategory/:id', controller.eraseCategory);

router.get('/eraseCollection/:id', controller.eraseCollection);

router.get('/eraseItem/:id', controller.eraseItem);

router.get('/editItem/:id', controller.showEditItem);

router.post('/editItem/:id', controller.editItem);

router.get('/editCollector/:id', controller.showEditCollectorForm);

router.post('/editCollector/:id', collectorValidator, controller.editCollector);

router.post('/filter/collector', controller.filterCollector);

router.post('/filter/item', controller.filterItem);

router.post('/filter/collection', controller.filterCollection);

router.post('/filter/category', controller.filterCategory);

module.exports = router;