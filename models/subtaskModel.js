const mongoose = require('mongoose');
const subtaskSchema = new mongoose.Schema({
    title: { type: String },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Subtask', subtaskSchema);