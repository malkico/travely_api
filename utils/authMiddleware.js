const jwt = require("jsonwebtoken")

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access. Missing authentication token."
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.influencer = decodedToken.influencer
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access. Invalid authentication token."
        })
    }
}
