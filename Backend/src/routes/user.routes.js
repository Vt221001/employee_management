import express from "express";
import {
    allUsers,
    changeUserPassword,
    refreshAccessTokenUser,
    singleUser,
    userDelete,
    userLogin,
    userLogout,
    userRegister,
    userUpdate,
} from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.middleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware.js";
import { getAllProjectUserAndTask } from "../controller/project.controller.js";

const router = express.Router();

router.post("/user-register", userRegister);
router.post("/user-login", userLogin);
router.post("/user-logout", userLogout);
router.post("/user-refresh-token", refreshAccessTokenUser);
router.get("/all-users", authenticateToken, allUsers);
router.get("/single-user/:userId", singleUser);
router.put("/update-user/:userId", userUpdate);
router.delete("/delete-user/:userId", userDelete);
router.put("/change-user-password/:userId", changeUserPassword);
router.get("/dashboard-data", getAllProjectUserAndTask);

export { router as userRouter };
