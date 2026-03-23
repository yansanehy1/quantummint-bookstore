module.exports = (req, res, next) => {
    req.id = Math.random().toString(36).substring(7);
    next();
};
