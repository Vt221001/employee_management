import { ApiError } from "../util/errorHandler.js";

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    `Role (${req.user.role}) is not allowed to access this resource`
                )
            );
        }
        next();
    };
}

export { authorizeRoles };
