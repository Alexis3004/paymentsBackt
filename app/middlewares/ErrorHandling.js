
const ErrorHandling = (err, req, res, next) => {
    console.log('ErrorHandling',err)
    if (err.name === "UnauthorizedError") {
        res.status(401).send("invalid token...");
    } else {
        next(err);
    }
}

module.exports = ErrorHandling;
