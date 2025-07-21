import express from "express"
import { configDotenv } from "dotenv"
import cors from "cors";
import authRoute from "./route/authRoute.js";
import LearnerRoute from "./route/learnerRoute.js";
import teacherRoute from "./route/teacherRoute.js";
configDotenv();
import { connectDb } from "./config/db.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { createServer } from "http"; // ✅ Import for HTTP server
import { Server } from "socket.io";  // ✅ Import for Socket.IO
import { ChatDesign } from "./models/chat.js";
const app = express()
const server = createServer(app)
connectDb();
app.use(helmet());
app.use(cors({
    origin: 'https://skillbackend-r7sc.onrender.com/',
    credentials: true,
}));
// Sets secure HTTP headers
const io = new Server(server, {
    cors: {
        origin: "https://skillbackend-r7sc.onrender.com/",
        credentials: true,
    },
});
app.use(cookieParser());
app.use(express.json())                  // Prevent XSS attacks
app.use(hpp());
// ✅ Rate limiter to prevent abuse (e.g., 100 requests per 15 min)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP
});
app.use(limiter);                  // Prevent HTTP parameter pollution
app.use("/auth", authRoute)
app.use("/learner", LearnerRoute)
app.use("/teacher", teacherRoute)
const port = process.env.PORT

//Socket.io

io.on("connection", (socket) => {
    console.log("✅ New user connected: ", socket.id)

    // Join a shared room for conversation
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId)
        console.log(`📥 User joined room: ${roomId}`)
    })

    // Send and store the message
    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, text, senderRole } = data

        try {
            const participants = [String(senderId), String(receiverId)].sort()
            const roomId = participants.join("-")

            const newMessage = {
                text,
                from: senderId,
                senderRole: senderRole, // Store the role for proper display
                timestamp: new Date(),
            }

            let chat = await ChatDesign.findOne({ participants })
            if (chat) {
                chat.messages.push(newMessage)
                await chat.save()
            } else {
                chat = new ChatDesign({
                    participants,
                    messages: [newMessage],
                })
                await chat.save()
            }

            // Emit to the shared room instead of individual user rooms
            socket.to(roomId).emit("receiveMessage", newMessage)
            console.log(`📤 Message sent to room ${roomId}:`, newMessage)
        } catch (err) {
            console.error("❌ Error saving message:", err)
        }
    })

    socket.on("disconnect", () => {
        console.log("❌ User disconnected: ", socket.id)
    })
})

server.listen(port, () => {
    console.log(`Server connect successfully port http://localhost:${port}/`)
})