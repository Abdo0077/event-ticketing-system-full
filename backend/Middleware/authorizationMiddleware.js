

module.exports = function authorizationMiddleware(roles) {
    return (req, res, next) => {
        console.log('req:', req.user)
        const userRole = req.user.role;
        console.log("userRole: ", userRole);
        console.log("roles: ", roles);
        if (!roles.includes(userRole))
            return res.status(403).json("unauthorized access");
        //console.log('authormid')
        next();
    };
}
