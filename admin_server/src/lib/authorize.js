const User_Role = require("../models/user_role/User_Role.mongo");

const authorize = (requiredModuleId) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user || !user.Roles || !Array.isArray(user.Roles)) {
                return res.status(403).json({
                    error: "Access denied: No roles assigned to user",
                    done: false,
                });
            }

            // Fetch all roles associated with the user
            const userRoles = await User_Role.find({
                _id: { $in: user.Roles }
            });

            // Check if any of the user's roles contain the required module ID
            const hasAccess = userRoles.some(role =>
                role.Modules && role.Modules.includes(requiredModuleId)
            );

            if (hasAccess) {
                next();
            } else {
                return res.status(403).json({
                    error: "Access denied: Insufficient permissions for this module",
                    done: false,
                });
            }
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({
                error: "Internal Server Error during authorization",
                done: false,
            });
        }
    };
};

module.exports = { authorize };
