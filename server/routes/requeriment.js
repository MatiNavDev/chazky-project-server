const express = require('express');

const { getRequeriments } = require('../controllers/requeriment');

const router = express.Router();

router.use('/', getRequeriments);

module.exports = router;
