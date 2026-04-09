const userModel = require('../../models/userModel');
const projectModel = require('../../models/projectModel');
const logActivity = require('../utils/activityLogger');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingProject = await projectModel.findOne({ name });
        if (existingProject) {
            return res.status(400).json({ message: 'Project already exists' });
        }
        const project = new projectModel({ name, description, createdBy: req.user.id });
        await project.save();
        await logActivity({ action: 'PROJECT_CREATED', userId: req.user.id, projectId: project._id });
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const projects = await projectModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'creator'
                }
            },

            { $unwind: '$creator' },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'tasks'
                }
            },

            { $addFields: { taskCount: { $size: '$tasks' } } },
            { $skip: skip },
            { $limit: parseInt(limit) }

        ]);
        res.status(200).json({ message: 'Projects retrieved successfully', projects });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateProject = async (req, res) => {
 try{
    const {id} = req.params;
    console.log("projectId:", id);

    const { name, description } = req.body;

    const project = await projectModel.findOne({ _id: id, isDeleted: false });
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    await logActivity({ action: 'PROJECT_UPDATED', userId: req.user.id, projectId: project._id });
    res.status(200).json({ message: 'Project updated successfully', project });
 }catch (error) {
    res.status(500).json({ message: 'Server error' });
 }
}

exports.deleteProject = async (req, res) => {
try {
    const { id } = req.params;

    const project = await projectModel.findOne({ _id: id, isDeleted: false });
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    project.isDeleted = true;
    await project.save();
    await logActivity({ action: 'PROJECT_DELETED', userId: req.user.id, projectId: project._id });
    res.status(200).json({ message: 'Project deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Server error' });
}
}

exports.getProjectDropdown = async (req, res) => {
    try {
        const projects = await projectModel.find({ isDeleted: false }, { name: 1 });
        res.status(200).json({ message: 'Project dropdown retrieved successfully', projects });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}