const authorizeUserTypes = (allowedUserTypes) => {
    return (req, res, next) => {
        try {
            // Ensure req.user exists and has a user_type_id
            if (!req.user || !req.user.user_type_id) {
                return res.status(403).json({ msg: "Unauthorized access" });
            }

            // Check if user's user_type_id is included in allowedUserTypes array
            if (!allowedUserTypes.includes(req.user.user_type_id)) {
                return res.status(403).json({ msg: "Unauthorized access" });
            }

            // User is authorized, proceed to next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Internal Server Error" });
        }
    };
};

module.exports = authorizeUserTypes;
