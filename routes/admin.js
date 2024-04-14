const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController')

router.get('/', controller.showAdminPage)

router.post('/addCategory', controller.addCategory);

router.get('/eraseCollector/:id', controller.eraseCollector);

router.get('/eraseCategory/:id', controller.eraseCategory);

router.get('/eraseCollection/:id', controller.eraseCollection);

router.get('/eraseItem/:id', controller.eraseItem);

router.get('/editCollector/:id', controller.showEditCollectorForm)

router.post('/editCollector/:id', controller.editCollector)

module.exports = router;