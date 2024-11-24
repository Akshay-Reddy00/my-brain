import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD)

    if(decoded) {
        req.userId = (decoded as JwtPayload).id;
        next();
    } else {
        res.status(403).json({
            message: "Your are not logged in"
        })
    }
}