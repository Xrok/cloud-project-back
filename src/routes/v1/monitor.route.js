const express = require('express');
const MonitorController = require('../../controllers/monitor.controller');

const router = express.Router();

router.get('/', MonitorController.getMonitors);

module.exports = router;
