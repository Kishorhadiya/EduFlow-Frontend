const Submission = require('../models/Submission');

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Private (Student)
const submitAssignment = async (req, res) => {
    const { assignmentId, submissionLink } = req.body;
    try {
        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            assignmentId,
            studentId: req.user._id
        });

        if (existingSubmission) {
            existingSubmission.submissionLink = submissionLink;
            existingSubmission.status = 'submitted';
            existingSubmission.marks = undefined;
            existingSubmission.feedback = '';
            await existingSubmission.save();
            return res.json(existingSubmission);
        }

        const submission = await Submission.create({
            assignmentId,
            studentId: req.user._id,
            submissionLink
        });
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get submissions for an assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Teacher)
const getAssignmentSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in student's submissions
// @route   GET /api/submissions/my-submissions
// @access  Private (Student)
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user._id })
            .populate('assignmentId', 'title dueDate');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Evaluate a submission (Marks & Feedback)
// @route   PUT /api/submissions/:id/evaluate
// @access  Private (Teacher)
const evaluateSubmission = async (req, res) => {
    const { marks, feedback } = req.body;
    try {
        if (marks > 100) {
            return res.status(400).json({ message: 'Marks cannot exceed 100' });
        }
        const submission = await Submission.findById(req.params.id).populate({
            path: 'assignmentId',
            select: 'createdBy'
        });
        
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        if (submission.assignmentId.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to grade this assignment' });
        }

        submission.marks = marks;
        submission.feedback = feedback;
        submission.status = 'reviewed';
        await submission.save();

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a submission
// @route   DELETE /api/submissions/:id
// @access  Private (Student)
const deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Make sure user is submission owner
        if (submission.studentId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await submission.deleteOne();
        res.json({ message: 'Submission removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitAssignment,
    getAssignmentSubmissions,
    getMySubmissions,
    evaluateSubmission,
    deleteSubmission
};
