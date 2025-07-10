
const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  createReport,
  getReports,
  getReport,
  updateReport,
  submitReport
} = require('../controllers/reportController');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

router.post('/', authorize('technician'), createReport);
router.get('/', getReports);
router.get('/:id', getReport);
router.put('/:id', updateReport);
router.patch('/:id/submit', authorize('technician'), submitReport);

module.exports = router;