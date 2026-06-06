const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissionLink: { type: String, required: true },
    marks: { type: Number },
    feedback: { type: String },
    status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
