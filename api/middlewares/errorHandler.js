// All time use:

const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error", err });
}

export default errorHandler;