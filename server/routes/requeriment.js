const express = require('express');

const {} = require('../controllers/requeriment');

const router = express.Router();

router.use('/', () => console.log('requeriment'));

module.exports = router;
