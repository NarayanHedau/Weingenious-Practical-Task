const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
    name:{ type: String },
    description:{ type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);