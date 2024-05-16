import JWT from 'jsonwebtoken'

export const checkAuthorization = async (req, res, next) => {
    if (req.path == `/api/auth/login` || req.path == `/api/employee/add` || req.path == `/api/auth/forgot-password`) {
        return next();
    }
    const cookie = req.headers.cookie;
    if (!cookie) {
        return res.status(401).json({ success: false, message: "Cookie not found in request header. Please login to proceed" })
    }

    const token = cookie.split("=")[1]; 
    if (!token) {
        return res.status(401).json({ success: false, message: "Token not found in request header. Please login to proceed" })
    }

    JWT.verify(String(token), process.env.JWT_SECRET_KEY, (err, user)=> {
        if(err){
            return res.status(401).json({success: false, message: "Invalid token"})
        }
        req.user = user
        next()
    })
}