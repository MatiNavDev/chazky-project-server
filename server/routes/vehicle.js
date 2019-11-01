const express = require('express');

const { getVehicles } = require('../controllers/vehicle');

const router = express.Router();

router.use('/', getVehicles);

module.exports = router;
