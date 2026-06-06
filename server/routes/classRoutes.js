const express = require('express');
const router = express.Router();
const { createClass, getClasses, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('teacher'), createClass);
router.get('/', getClasses);
router.put('/:id', protect, authorize('teacher'), updateClass);
router.delete('/:id', protect, authorize('teacher'), deleteClass);

module.exports = router;
