export const error = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({success: false, message: "Internal Error Ocurred!", technicalMessage: err.message})
}