import jwt from "jsonwebtoken"

function authAdminToken(req, res, next) {
    const { authorization } = req.headers
    
    const adminAuthToken  = authorization.split(" ")[1]
    if (!adminAuthToken ) return res.status(401).json("Need token")

    try {
        const decoded = jwt.verify(adminAuthToken , process.env.ADMIN_SECRET_KEY)
        req.adminId = decoded.adminId
        next()
    } catch (error) {
        res.status(403).json("Invalid Token")
    }
}

export default authAdminToken