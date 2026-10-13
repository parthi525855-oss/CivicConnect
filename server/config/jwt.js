/**
 * CivicConnect JWT Configuration Helper
 * Loads JWT_SECRET from environment variables.
 * In production, fails safely if JWT_SECRET is not configured.
 * In development, issues a clear security warning.
 */

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
    }
    // Safe development fallback (non-production only)
    return 'civicconnect_dev_fallback_secret_key_change_in_production_2026';
  }
  return secret;
};

module.exports = {
  getJwtSecret
};
