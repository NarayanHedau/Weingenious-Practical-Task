const joi = require('joi');

exports.createTaskSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    projectId: joi.string().required(),
    assignedTo: joi.string().optional(),
    priority: joi.string().valid('low', 'medium', 'high').optional(),
})
exports.createSubtaskSchema = joi.object({
    title: joi.string().required(),
    taskId: joi.string().required(),
})

exports.updateSubTaskSchema = joi.object({
    title: joi.string().optional(),
    description: joi.string().optional(),
    status: joi.string().valid('pending', 'in-progress', 'completed').optional(),
});
