
const express = require('express');
const { 
  getAllUsers, 
  createUser, 
  updateUser, 
  toggleUserStatus 
} = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protégées - accessible seulement aux admins
router.get('/', authenticateToken, authorize('admin'), getAllUsers);
router.post('/', authenticateToken, authorize('admin'), createUser);
router.put('/:id', authenticateToken, authorize('admin'), updateUser);
router.patch('/:id/toggle-status', authenticateToken, authorize('admin'), toggleUserStatus);

module.exports = router;