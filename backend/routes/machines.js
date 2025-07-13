
const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const { getMachines,createMachine } = require('../controllers/machineController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getMachines);
router.post('/', authorize('admin', 'administration'), createMachine);

module.exports = router;
