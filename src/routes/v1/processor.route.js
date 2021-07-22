const express = require('express');
const processorController = require('../../controllers/processor.controller');

const router = express.Router();

router.get('/', processorController.getProcessors);

module.exports = router;
