import express from "express"
import { authMiddleWare, authorizeRole } from "../middleware/middleware.js";
import { acceptStatus, getRequestCount, getteacherDetails, viewTeacher } from "../controllers/teacher.controller.js";

const teacherRoute = express.Router();

teacherRoute.get("/incoming/:teacherId",authMiddleWare,authorizeRole('teacher'),viewTeacher)
teacherRoute.patch("/update/:id",authMiddleWare,authorizeRole('teacher'),acceptStatus)
teacherRoute.get("/count/:teacherId",authMiddleWare,authorizeRole('teacher'),getRequestCount)
teacherRoute.get('/get/:teacherId',authMiddleWare,authorizeRole('teacher'),getteacherDetails)

export default teacherRoute