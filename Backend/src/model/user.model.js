import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        default: "employee",
        enum: ["Admin", "ProjectManager", "TeamMember", "Client"],
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"],
    },
    phone: {
        type: Number,
        trim: true,
        required: true,
    },

    photo: {
        type: String,
        default:
            "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        trim: true,
    },
    refreshToken: {
        type: String,
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

export const User = mongoose.model("User", userSchema);
