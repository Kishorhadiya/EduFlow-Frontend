const express = require('express');
const router = express.Router();
const {
    submitAssignment,
    getAssignmentSubmissions,
    getMySubmissions,
    evaluateSubmission,
    deleteSubmission
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), submitAssignment);
router.get('/assignment/:assignmentId', protect, authorize('teacher'), getAssignmentSubmissions);
router.get('/my-submissions', protect, authorize('student'), getMySubmissions);
router.put('/:id/evaluate', protect, authorize('teacher'), evaluateSubmission);
router.delete('/:id', protect, authorize('student'), deleteSubmission);

module.exports = router;
