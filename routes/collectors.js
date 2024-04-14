const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectorController');
const upload = require('../middleware/multer')

router.get('/register', controller.showRegisterForm);

router.post('/register', upload("collectors"), controller.registerCollector);

router.get('/login', controller.showLoginForm);

router.post('/login', controller.login);

router.get('/:id', controller.showCollectorNoPerm)

router.get('/:id/logged', controller.showCollector)

router.get('/:id/addItem', controller.showFormAddItem);

router.get('/:id/eraseItem/:itemId', controller.eraseItem);

router.post('/:id/addItem', upload("items"), controller.addItem);

router.get('/:id/editItem/:itemId', controller.showFormEditItem);

router.post('/:id/editItem/:itemId', controller.editItem);




module.exports = router;

