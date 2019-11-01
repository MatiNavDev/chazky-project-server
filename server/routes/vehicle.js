const express = require('express');

const {} = require('../controllers/vehicle');

const router = express.Router();

router.use('/', () => console.log('vehicle'));

module.exports = router;
