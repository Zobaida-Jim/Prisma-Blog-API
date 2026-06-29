import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { jwtUtils } from "../utils/jwt.js";
import config from "../config/index.js";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    //auth(Role.ADMIN, Role.USER, Role.AUTHOR)
    //auth => ...requiredRoles => [Role.ADMIN, Role.USER, Role.AUTHOR]
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(" ")[1] :
                req.headers.authorization

        if (!token) {
            throw new Error("You are not logged in. Please login to access this resource.");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.message)
        }

        const { id, name, email, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden. You don't have permission to access this !");
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        })

        if (!user) {
            throw new Error("User not found. Please login again");
        }

        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account has been blocked. Please contact support.");
        }

        req.user = {
            id,
            name,
            email,
            role
        }
        next();
    })
}