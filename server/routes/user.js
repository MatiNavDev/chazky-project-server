const express = require('express');

const { getUsers, setUserSearchingTravel, cleanAllUsers } = require('../controllers/user');

const router = express.Router();

router.get('/', getUsers);

router.post('/', setUserSearchingTravel);
router.post('/cleanAll', cleanAllUsers);

module.exports = router;
