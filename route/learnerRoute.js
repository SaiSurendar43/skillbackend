import express from "express"
import { chatMessage, getlearnerDetails, getRequestCount, GetTeacherSkill, skillRequest, ViewRequest } from "../controllers/learner.controller.js";
import { authMiddleWare, authorizeRole } from "../middleware/middleware.js";

const LearnerRoute = express.Router();

LearnerRoute.get("/teachers", authMiddleWare, authorizeRole("learner"), GetTeacherSkill);
LearnerRoute.post("/request",authMiddleWare,authorizeRole("learner"),skillRequest)
LearnerRoute.get("/view/:learnerId",authMiddleWare,authorizeRole("learner"),ViewRequest)
LearnerRoute.get("/chatmsg",chatMessage)
LearnerRoute.get("/count/:learnerId",authMiddleWare,authorizeRole("learner"),getRequestCount)
LearnerRoute.get('/get/:learnerId',authMiddleWare,authorizeRole('learner'),getlearnerDetails)

export default LearnerRoute