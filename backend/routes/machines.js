
const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const { getMachines,createMachine } = require('../controllers/machineController');
const { uploadMachineImage, processUploadedFiles } = require('../middleware/upload');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getMachines);
router.post('/', authorize('admin', 'administration'), uploadMachineImage, processUploadedFiles, createMachine);

module.exports = router;
