const mongoose = require('mongoose');
const userModel = require('../../models/userModel');
const projectModel = require('../../models/projectModel');
const taskModel = require('../../models/taskModel');
const subtaskModel = require('../../models/subtaskModel');
const logActivity = require('../utils/activityLogger');


exports.createTask = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const { title, description, projectId, assignedTo, priority } = req.body;

        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(400).json({ message: 'Project not found' });
        }

        if (assignedTo) {
            const user = await userModel.findById(assignedTo);
            if (!user) {
                return res.status(400).json({ message: 'Assigned user not found' });
            }
        }

        const existTask = await taskModel.findOne({
            title,
            projectId,
            isDeleted: false
        });
        if (existTask) {
            return res.status(400).json({ message: 'Task already exists' });
        }

        const task = new taskModel({ title, description, projectId, assignedTo, createdBy: req.user.id, priority });
        await task.save();
        await logActivity({ action: 'TASK_CREATED', userId: req.user.id, projectId, taskId: task._id });
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createSubtask = async (req, res ) => {
    try {
        console.log("req.user:", req.user);
        const { title, taskId } = req.body;
        console.log("taskId:", taskId);
        console.log("title:", title);

        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(400).json({ message: 'Task not found' });
        }

        const createSubtask = await subtaskModel.create({ title, taskId });
        await logActivity({ action: 'SUBTASK_CREATED', userId: req.user.id, taskId, subtaskId: createSubtask._id });
        res.status(201).json({ message: 'Subtask created successfully', createSubtask });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateSubtask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, title } = req.body;

        const subtask = await subtaskModel.findByIdAndUpdate(id, { status, title }, { new: true });
        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        await logActivity({ action: 'SUBTASK_UPDATED', userId: req.user.id, taskId: subtask.taskId, subtaskId: subtask._id });
        res.status(200).json({ message: 'Subtask updated successfully', subtask });
    } catch (error) {
        console.log("Error updating subtask:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getTaskList = async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const skip = (page - 1) * limit;

        const { projectId } = req.params;

        const project = await projectModel.findOne({ _id: projectId, isDeleted: false });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const { status, priority, user, sort } = req.query;

        let sortOption
        if (sort) {
            sortOption = sort === 'asc' ? 1 : -1;
        }
        let query = {projectId: new mongoose.Types.ObjectId(projectId), isDeleted: false };
        if (status) {
            query.status = status;
        }
        if (priority) {
            query.priority = priority;
        }
        if (user) {
            query.assignedTo = new mongoose.Types.ObjectId(user);
        }

        const tasks = await taskModel.aggregate([
            { $match: query },
            {
                $lookup:{
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: "$project" },
            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedUser"
                }
            },
            { $unwind: "$assignedUser" },
            {
                $lookup: {
                    from: "subtasks",
                    localField: "_id",
                    foreignField: "taskId",
                    as: "subtasks"
                }
            },
            { $unwind: "$subtasks" },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "creator"
                }
             },
             { $unwind: "$creator"}, 
             {
                $project: {
                    title: 1,
                    description: 1,
                    priority: 1,
                    status: 1,
                    projectName : "$project.name",
                    assignedUserName: "$assignedUser.name",
                    subtaskTitle: "$subtasks.title",
                    subtaskStatus: "$subtasks.status",
                    creatorName: "$creator.name",
                    isDeleted: 1, createdAt: 1, updatedAt: 1
                }
             },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {$sort: { createdAt: sortOption || -1 } }
        ]);
        res.status(200).json({ message: 'Task list fetched successfully', tasks });
    } catch (error) {
        console.log("Error fetching task list:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteTask = async (req, res) => {
try {
    const { id } = req.params;
    const task = await taskModel.findOne({ _id: id, isDeleted: false });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    task.isDeleted = true;
    await task.save();
    await logActivity({ action: 'TASK_DELETED', userId: req.user.id, projectId: task.projectId, taskId: task._id });
    res.status(200).json({ message: 'Task deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Server error' });
}
}

