const ActivityLog = require('../../models/activityLogsModel');

exports.getActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, action, userId, projectId, taskId } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (action) filter.action = action;
        if (userId) filter.userId = userId;
        if (projectId) filter.projectId = projectId;
        if (taskId) filter.taskId = taskId;

        const [logs, total] = await Promise.all([
            ActivityLog.find(filter)
                .populate('userId', 'name email')
                .populate('projectId', 'name')
                .populate('taskId', 'title')
                .populate('subtaskId', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ActivityLog.countDocuments(filter)
        ]);

        res.status(200).json({
            message: 'Activity logs retrieved successfully',
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            logs
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
