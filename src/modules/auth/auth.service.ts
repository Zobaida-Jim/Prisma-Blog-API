import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { IAuth } from "./auth.interface.js";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config/index.js";
import { jwtUtils } from "../../utils/jwt.js";

const loginUser = async (payload: IAuth) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.activeStatus === "BLOCKED") {
        throw new Error("Your account has been blocked. Please contact support.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )

    return {
        accessToken, refreshToken
    }
}

const refreshToken = async (refreshToken: string) => {
    //Verify the refresh token
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.message);
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findFirstOrThrow({
        where: { id }
    });

    if (user.activeStatus === "BLOCKED") {
        throw new Error("User is Blocked!")
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    return { accessToken }
}

export const authService = {
    loginUser,
    refreshToken
}