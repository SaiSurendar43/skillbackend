import express from "express"
import { Login, Register } from "../controllers/user.controller.js";

const authRoute = express.Router();

authRoute.post("/reg",Register)
authRoute.post("/login",Login);


export default authRoute