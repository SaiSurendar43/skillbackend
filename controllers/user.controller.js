import { User } from "../models/usermodel.js"
import bcrpt from "bcrypt"
import jwt from "jsonwebtoken"


export const Register = async (req, res) => {

    const { name, email, password, role,skills } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({
                error: "user already exists"
            })
        }

        const hashPassword = await bcrpt.hash(password, 10)
        const user = new User({
            name,
            email,
            password: hashPassword,
            role,
            skills:role === "teacher" ? skills : []
        })
        await user.save();
        res.status(200).json({
            message: "Register successfully"
        })
    }

    catch (error) {
        res.status(400).json({
            error: error.message
        })
    }

}

export const Login = async (req, res) => {
    const { email, password, role } = req.body
    try {
        if (!email || !password) {
            res.status(400).json({
                error: "Email and Password is Required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            res.status(404).json({
                error: "User Not Found!"
            })
        }

        const isMatch = bcrpt.compare(password, user.password)

        if (!isMatch) {
            res.status(401).json({
                error: "Password is Incorrect"
            })
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "dev", // set to true
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
            message: "Login Successfull",
            token,
            user
        })
    }

    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}







