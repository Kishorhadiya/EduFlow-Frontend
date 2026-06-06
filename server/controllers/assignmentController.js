const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Class = require('../models/Class');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
const createAssignment = async (req, res) => {
    const { title, description, dueDate, classId } = req.body;
    try {
        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            classId,
            createdBy: req.user._id
        });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignments for logged in student's class
// @route   GET /api/assignments/my-assignments
// @access  Private (Student)
const getMyAssignments = async (req, res) => {
    try {
        if (!req.user.classId) {
            return res.status(400).json({ message: 'Student not assigned to a class' });
        }
        const assignments = await Assignment.find({ classId: req.user.classId }).populate('createdBy', 'name');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignments by class ID
// @route   GET /api/assignments/class/:classId
// @access  Private (Teacher)
const getClassAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            classId: req.params.classId,
            createdBy: req.user._id
        }).populate('classId', 'className');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teacher)
const updateAssignment = async (req, res) => {
    const { title, description, dueDate, classId } = req.body;
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Make sure user is assignment owner
        if (assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        assignment.title = title || assignment.title;
        assignment.description = description || assignment.description;
        assignment.dueDate = dueDate || assignment.dueDate;
        assignment.classId = classId || assignment.classId;

        const updatedAssignment = await assignment.save();
        res.json(updatedAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teacher)
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Make sure user is assignment owner - robust string comparison
        if (assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this assignment' });
        }

        // Requirement: Prevent deletion if any student has already submitted work
        const submissionCount = await Submission.countDocuments({ assignmentId: req.params.id });
        if (submissionCount > 0) {
            return res.status(400).json({ message: 'Cannot delete assignment: Submissions already exist.' });
        }

        await assignment.deleteOne();
        res.json({ message: 'Assignment removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all assignments created by logged in teacher
// @route   GET /api/assignments/created-by-me
// @access  Private (Teacher)
const getMyCreatedAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ createdBy: req.user._id })
            .populate('classId', 'className department');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeacherStats = async (req, res) => {
    try {
        const totalClasses = await Class.countDocuments({});
        const totalAssignments = await Assignment.countDocuments({ createdBy: req.user._id });

        // Find all assignments by this teacher to find their submissions
        const teacherAssignments = await Assignment.find({ createdBy: req.user._id }).select('_id');
        const assignmentIds = teacherAssignments.map(a => a._id);

        const pendingReviews = await Submission.countDocuments({
            assignmentId: { $in: assignmentIds },
            status: 'submitted'
        });

        res.json({
            totalClasses,
            totalAssignments,
            pendingReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAssignment,
    getMyAssignments,
    getClassAssignments,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getMyCreatedAssignments,
    getTeacherStats
};
