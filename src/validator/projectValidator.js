const joi = require('joi');

exports.createProjectSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
})
exports.updateProjectSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    status: joi.string().valid('pending', 'in-progress', 'completed'),
})

