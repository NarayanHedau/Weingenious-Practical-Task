const express = require('express');
require('dotenv').config();
const authRoutes = require('./src/routes/authRoute');
const projectRoutes = require('./src/routes/projectRouter');
const taskRoutes = require('./src/routes/taskRoute');
const activityLogRoutes = require('./src/routes/activityLogRoute');

const app = express();
const connectDB = require('./config/db');
app.use(express.json());

connectDB();



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity-logs', activityLogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


