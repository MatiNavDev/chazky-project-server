const express = require('express');

const {
  getVehicles,
  setVehicleSearchingTravel,
  notUsedAnymore
} = require('../controllers/vehicle');

const router = express.Router();

router.get('/', getVehicles);

router.post('/', setVehicleSearchingTravel);
router.post('/notUsedAnymore', notUsedAnymore);

module.exports = router;
