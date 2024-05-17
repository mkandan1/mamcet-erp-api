export const decryptMiddleware = (req, res, next) => {
    if (!req.body.data) {
        return next();
    }
    try{
        req.body = req.body.data;
        next();
    }
    catch(err){
        next(err);
    }
}