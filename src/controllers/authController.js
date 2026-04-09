const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logActivity = require('../utils/activityLogger');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword, role });
        await user.save();
        await logActivity({ action: 'USER_REGISTERED', userId: user._id });
        res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();

        const response = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
            refreshToken: refreshToken
        };
        await logActivity({ action: 'USER_LOGGED_IN', userId: user._id });
        res.status(200).json({ message: 'Login successful',response });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

