import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./routes/user.routes.js";
import { ApiError } from "./util/errorHandler.js";
import dotenv from "dotenv";
import { projectRouter } from "./routes/project.routes.js";
import { taskRouter } from "./routes/task.routes.js";

dotenv.config();

const app = express();

console.log(process.env.CORS_ORIGIN);

app.use(
    cors({
        origin: [
            "http://localhost:5174",
            "http://localhost:3000",
            "https://emp.vedanshtiwari.tech",
        ],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Welcome to our auto-productivity  Deployment is complete");
});

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

app.use("/api", userRouter);
app.use("/api", projectRouter);
app.use("/api", taskRouter);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

// i am push new updates

export { app };
