import Joi from "joi";

const userValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim(),
    role: Joi.string()
        .valid("Admin", "ProjectManager", "TeamMember", "Client")
        .default("TeamMember"),
    status: Joi.string().valid("active", "inactive").default("active"),
    phone: Joi.number().required(),
    photo: Joi.string()
        .uri()
        .allow("")
        .default(
            "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
        )
        .trim(),
});

export const validateUser = (userData) => {
    return userValidationSchema.validate(userData, { abortEarly: false });
};
