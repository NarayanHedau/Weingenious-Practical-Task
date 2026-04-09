const ActivityLog = require('../../models/activityLogsModel');

/**
 * Log an activity to the database.
 * @param {Object} options
 * @param {string}  options.action     - Action label e.g. 'PROJECT_CREATED'
 * @param {string}  [options.userId]   - ID of the user who performed the action
 * @param {string}  [options.projectId]
 * @param {string}  [options.taskId]
 * @param {string}  [options.subtaskId]
 */
const logActivity = async ({ action, userId, projectId, taskId, subtaskId }) => {
    try {
        await ActivityLog.create({ action, userId, projectId, taskId, subtaskId });
    } catch (err) {
        console.error('Activity log error:', err.message);
    }
};

module.exports = logActivity;
