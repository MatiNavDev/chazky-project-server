const express = require('express');

const {
  getVehicles,
  setVehicleSearchingTravel,
  notUsedAnymore,
  acceptUser,
  cleanAllVehicles
} = require('../controllers/vehicle');

const router = express.Router();

router.get('/', getVehicles);

router.post('/', setVehicleSearchingTravel);
router.post('/notUsedAnymore', notUsedAnymore);
router.post('/acceptUser', acceptUser);
router.post('/cleanAll', cleanAllVehicles);

module.exports = router;
