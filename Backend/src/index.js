import dotenv from "dotenv";
import connectDB from "./Db/db.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

connectDB()
    .then(() => {
        console.log("✅ DB connected successfully");

        server.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });

        app.on("error", (error) => {
            console.log("Error is here: ", error);
            throw error;
        });
    })
    .catch((err) => {
        console.log(err);
    });

io.on("connection", (socket) => {
    console.log(`🔥 New client connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

export { io };
