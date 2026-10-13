const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');
const { getJwtSecret } = require('../config/jwt');

const generateToken = (id) => {
  return jwt.sign(
    { id: id.toString() },
    getJwtSecret(),
    {
      expiresIn: '30d'
    }
  );
};


// @desc    Register a new citizen/user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await dataService.findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CRITICAL SECURITY FIX: Public registration MUST ALWAYS create role = 'citizen'.
    // User-supplied role from the client is strictly ignored to prevent privilege escalation.
    const assignedRole = 'citizen';

    const user = await dataService.createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : ''
    });

    const userId = user._id || user.id;
    const token = generateToken(userId);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: userId,
        _id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await dataService.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const userId = user._id || user.id;
    const token = generateToken(userId);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userId,
        _id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await dataService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        _id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
