import { User } from "../model/user.model.js";
import { generateAccessToken } from "../util/generateAcessToken.js";
import { generateRefreshToken } from "../util/generateRefreshToken.js";
import { ApiError } from "../util/errorHandler.js";
import { ApiResponse } from "../util/responseHandler.js";
import wrapAsyncUtil from "../util/wrapAsync.util.js";
import { validateUser } from "../validation/user.validation.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId, next) => {
    const user = await User.findById(userId);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    if (!accessToken || !refreshToken) {
        return next(new ApiError(500, "Failed to generate tokens"));
    }

    return { accessToken, refreshToken };
};

export const userRegister = wrapAsyncUtil(async (req, res) => {
    console.log("started");
    const { error } = validateUser(req.body);

    if (error) {
        throw new ApiError(400, error.details[0].message);
    }

    const emailExists = await User.findOne({ email: req.body.email }).select(
        "email"
    );

    if (emailExists) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Email already exists"));
    }

    const user = await User.create(req.body);
    res.status(201).json(
        new ApiResponse(201, user, "User created successfully")
    );
});

export const userLogin = wrapAsyncUtil(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
        "password name email role status loginTimes logoutTimes workingHours refreshToken"
    );

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (user.status === "inactive") {
        return next(
            new ApiError(
                403,
                "Your account is inactive. Please contact the admin."
            )
        );
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    user.refreshToken = refreshToken;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

export const userLogout = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.body;

    const user = await User.findById(userId).select(
        "loginTimes logoutTimes workingHours refreshToken"
    );

    if (!user) {
        res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    user.refreshToken = "";

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const refreshAccessTokenUser = wrapAsyncUtil(async (req, res, next) => {
    const { incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Please provide a refresh token");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        return next(new ApiError(401, "Invalid refresh token"));
    }
    const user = await User.findById(decodedToken?.id);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    if (user.refreshToken !== incomingRefreshToken) {
        return next(new ApiError(401, "Invalid refresh token"));
    }

    // const { accessToken, refreshToken: newRefreshToken } =
    //     await generateAccessAndRefreshTokens(user._id);

    const user2 = await User.findById(user._id);

    if (!user2) {
        return next(new ApiError(404, "User not found"));
    }

    const accessToken = generateAccessToken(user2);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed successfully"
            )
        );
});

export const userActiveInactive = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    user.status = user.status === "active" ? "inactive" : "active";

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                `User ${user.status === "active" ? "activated" : "inactivated"}`
            )
        );
});

export const allUsers = wrapAsyncUtil(async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.status(404).json(new ApiResponse(404, null, "No users found"));
    }
    res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

export const singleUser = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

export const userUpdate = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    const updated = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(new ApiResponse(200, updated, "User updated"));
});

export const userDelete = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json(new ApiResponse(200, null, "User deleted"));
});

export const changeUserPassword = wrapAsyncUtil(async (req, res, next) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    const isValidPassword = await user.isValidPassword(oldPassword);

    if (!isValidPassword) {
        return next(new ApiError(401, "Invalid password"));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Password changed"));
});
