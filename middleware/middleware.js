
import jwt from "jsonwebtoken"

export const authMiddleWare = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1]
    console.log(token)

    if (!token) {
        res.status(403).json({
            error: "unauthorized"
        })
    }

    try {
        console.log("verify")
        const decode = jwt.verify(token,process.env.SECRET_KEY)
        console.log(decode)
        req.user = decode
        next()
    }

    catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }


}

export const authorizeRole = (...allowedroles) => {
    return (req, res, next) => {
        if (!allowedroles.includes(req.user.role)) {

            res.status(403).json({
                error: "Unauthorized role"
            })
        }
        next();
    }
}