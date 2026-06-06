const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Teacher)
const createClass = async (req, res) => {
    const { className, department } = req.body;
    try {
        const newClass = await Class.create({ className, department });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public (or Private)
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private (Teacher)
const updateClass = async (req, res) => {
    const { className, department } = req.body;
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) {
            return res.status(404).json({ message: 'Class not found' });
        }

        cls.className = className || cls.className;
        cls.department = department || cls.department;

        const updatedClass = await cls.save();
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private (Teacher)
const deleteClass = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check if students are assigned
        const students = await User.findOne({ classId: req.params.id });
        if (students) {
            return res.status(400).json({ message: 'Cannot delete class with assigned students' });
        }

        await cls.deleteOne();
        res.json({ message: 'Class removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createClass,
    getClasses,
    updateClass,
    deleteClass
};
