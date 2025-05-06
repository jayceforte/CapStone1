 function requireAuth (req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status (401).json ({ message: "Unable to authorize: please log in"});
    }
    next();
 }
 module.exports = requireAuth;