const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    subtaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtask' },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', logSchema);