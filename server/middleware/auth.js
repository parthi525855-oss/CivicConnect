const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');
const { getJwtSecret } = require('../config/jwt');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        getJwtSecret()
      );

      const user = await dataService.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or invalid token'
        });
      }

      // Convert to a safe plain object without password.
      // Mongoose documents must use toObject() — spreading a Mongoose doc
      // with { ...doc } silently loses _id because Mongoose stores fields
      // in an internal $__ property, not as own enumerable properties.
      let plainUser;
      if (typeof user.toObject === 'function') {
        plainUser = user.toObject();
      } else {
        // JSON fallback store: user is already a plain object
        plainUser = { ...user };
      }
      delete plainUser.password;
      req.user = plainUser;
      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided'
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required'
    });
  }
};

module.exports = {
  protect,
  requireAdmin
};
