const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getMyAssignments,
    getClassAssignments,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getMyCreatedAssignments,
    getTeacherStats
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('teacher'), getTeacherStats);
router.post('/', protect, authorize('teacher'), createAssignment);
router.get('/my-assignments', protect, authorize('student'), getMyAssignments);
router.get('/created-by-me', protect, authorize('teacher'), getMyCreatedAssignments);
router.get('/class/:classId', protect, authorize('teacher'), getClassAssignments);
router.get('/:id', protect, getAssignmentById);
router.put('/:id', protect, authorize('teacher'), updateAssignment);
router.delete('/:id', protect, authorize('teacher'), deleteAssignment);

module.exports = router;
