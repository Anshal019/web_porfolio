// assets/js/admin-config.js
/**
 * ==========================================
 * 🔒 ADMIN CONFIGURATION
 * ==========================================
 * IMPORTANT: Add this file to your .gitignore.
 * NEVER commit this file to a public repository!
 * 
 * Default Username: super_cyber_admin
 * Default Password: change_me_immediately_99
 * 
 * To generate a new hash for your password, open your browser's console
 * on any page with bcrypt loaded and run:
 * bcrypt.hash("your_new_password", 10).then(console.log);
 * Then paste the new hash below.
 */

const ADMIN_CONFIG = {
    // The username for login
    USERNAME: "a4anshal",

    // The bcrypt hash of the password.
    // Hash for "anshal@1998"
    PASSWORD_HASH: "$2b$10$//MpCpWXmnxqlaz4eS8h9.pCXi1urf9lDPUk/kfV8StkYT1.qVezW",

    // Timeout for session inactivity in milliseconds (30 minutes)
    SESSION_TIMEOUT_MS: 30 * 60 * 1000
};

// Export if using modules, but since we're using vanilla JS script included
// it will be available globally on the admin pages.
