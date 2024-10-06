import { errorHandeler } from "./error.js";
import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {
    const token = req.cookies.acccess_token;
    if (!token) {
        return next(errorHandeler(401, "you are not authorized"))
    };

    jwt.verify(token, process.env.JWT_SECERT, (err, user) => {
        if (err) {
            return next(errorHandeler(401, "you are not Forbidden"));
        }
        req.user = user;
        next();
    });
};