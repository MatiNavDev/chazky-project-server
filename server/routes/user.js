const express = require('express');

const { getUsers, setUserSearchingTravel } = require('../controllers/user');

const router = express.Router();

router.get('/', getUsers);

router.post('/', setUserSearchingTravel);

module.exports = router;
