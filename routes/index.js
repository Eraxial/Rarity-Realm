const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');

/* GET home page. */
router.get('/', controller.showIndex)

module.exports = router;
