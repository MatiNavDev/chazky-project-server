const express = require('express');

const { getUsers } = require('../controllers/user');

const router = express.Router();

router.use('/', getUsers);

module.exports = router;
