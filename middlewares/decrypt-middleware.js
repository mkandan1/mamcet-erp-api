import CryptoJS from "crypto-js";

export const decryptMiddleware = (req, res, next) => {
    if (!req.body.data) {
        return next();
    }
    try{
        const encryptedData = req.body.data;
        const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_SECRET_KEY);
        req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        next();
    }
    catch(err){
        next(err);
    }
}