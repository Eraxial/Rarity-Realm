const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectorController');
const upload = require('../middleware/multer')

router.get('/', controller.showAllCollectors)

router.get('/register', controller.showRegisterForm);

router.post('/register', controller.registerCollector);



router.get('/:id/addItem', controller.showFormAddItem);

router.get('/:id/eraseItem/:itemId', controller.eraseItem);

router.post('/:id/addItem', upload("items"), controller.addItem);

router.get('/:id/editItem/:itemId', controller.showFormEditItem);

router.post('/:id/editItem/:itemId', controller.editItem);


router.get('/:id', controller.showCollector)


module.exports = router;

