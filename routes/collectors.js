const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectorController');
const upload = require('../middleware/multer')
const validateCollectorRules = require('../middleware/registerValidator');
const loginValidator = require('../middleware/loginValidator');
const itemValidator = require('../middleware/itemValidator');

router.get('/register', controller.showRegisterForm);

router.post('/register', upload("collectors"), validateCollectorRules, controller.registerCollector);

router.get('/login', controller.showLoginForm);

router.post('/login', loginValidator, controller.login);

router.get('/:id', controller.showCollectorNoPerm)

router.get('/:id/logged', controller.showCollector)

router.get('/:id/addItem', controller.showFormAddItem);

router.post('/:id/addCollection', controller.addCollection);

router.get('/:id/eraseItem/:itemId', controller.eraseItem);

router.post('/:id/addItem', upload("items"), itemValidator,  controller.addItem);

router.get('/:id/editItem/:itemId', controller.showFormEditItem);

router.post('/:id/editItem/:itemId', itemValidator, controller.editItem);

router.get('/:id/editCollector', controller.showEditCollectorForm);

router.post('/:id/editCollector', controller.editCollector);


module.exports = router;

