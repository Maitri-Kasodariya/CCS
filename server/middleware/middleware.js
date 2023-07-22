const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'config.env' });

exports.authorization = (req, res, next) =>
{
    // console.log("authorization called\n");
    const token = req.cookies.jwt;
    if (!token) {
        // simply return to login page
        return res
            .status(500)
            .render('error', { message: 'Access denied, You need to login or sign up.' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.id = data.id;
        req.email = data.email;
        req.role = data.role;
        next();
    } catch {
        return res
            .sendStatus(403)
            .render('error', { message: 'Invalid Token.' });
    }
}

exports.authorizationAdmin = (req, res, next) =>
{
    const token = req.cookies.jwt;
    if (!token) {
        // simply return to login page
        return res
            .status(500)
            .render('error', { message: 'Access denied, You need to login or sign up.' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.id = data.id;
        req.email = data.email;
        req.role = data.role;

        if (req.role !== "Admin" && req.role !== "Placement Manager") {
            return res
                .status(500)
                .render('error', { message: `Access denied, You don't have permission` });
        }
        next();
    } catch {
        return res
            .sendStatus(403)
            .render('error', { message: 'Invalid Token.' });
    }
}

exports.authorizationSuperAdmin = (req, res, next) =>
{
    const token = req.cookies.jwt;
    if (!token) {
        // simply return to login page
        return res
            .status(500)
            .render('error', { message: 'Access denied, You need to login or sign up.' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.id = data.id;
        req.email = data.email;
        req.role = data.role;

        if (req.role !== "Placement Manager") {
            return res
                .status(500)
                .render('error', { message: `Access denied, You don't have permission` });
        }
        next();
    } catch {
        return res
            .sendStatus(403)
            .render('error', { message: 'Invalid Token.' });
    }
}

exports.authorizationStudentAndAdmin = async (req, res, next) => 
{
    const token = req.cookies.jwt;
    if (!token) {
        // simply return to login page
        return res
            .status(500)
            .render('error', { message: 'Access denied, You need to login or sign up.' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.id = data.id;
        req.email = data.email;
        req.role = data.role;

        if (req.role !== "Student" && req.role !== "Admin" && req.role !== "Placement Manager") {
            return res
                .status(500)
                .render('error', { message: `Access denied, You don't have permission` });
        }
        next();
    } catch {
        return res
            .sendStatus(403)
            .render('error', { message: 'Invalid Token.' });
    }
};