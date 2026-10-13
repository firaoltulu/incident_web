const { verifySign } = require("../services/jwt");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                error: "Missing Authorization header",
                done: false,
            });
        }

        // Strip "Bearer " prefix if present
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        const { user } = await verifySign(token);

        if (user !== null) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({
                error: "Invalid or expired token",
                done: false,
            });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            error: "Internal Server Error during authentication",
            done: false,
        });
    }
};

module.exports = { authenticate };
