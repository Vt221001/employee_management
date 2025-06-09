import jwt from "jsonwebtoken";

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, email: user.email, name: user.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
};
