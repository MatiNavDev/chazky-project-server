const express = require('express');

const {
  getUsers,
  setUserSearchingTravel,
  notUsedAnymore,
  cleanAllUsers
} = require('../controllers/user');

const router = express.Router();

router.get('/', getUsers);

router.post('/', setUserSearchingTravel);
router.post('/notUsedAnymore', notUsedAnymore);
router.post('/cleanAll', cleanAllUsers);

module.exports = router;
