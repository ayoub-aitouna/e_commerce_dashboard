import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../../errors";
import { Response, Request, NextFunction } from "express"
import { JwtRequest } from "@/types/JwtRequest"
import { JwtToken } from "@/types/JwtToken"
import { AdminAtterbuites } from "@/models/Atterbuites/Admin"

require("dotenv").config();

const authenticationMiddleware = async (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const accessToken: string | undefined = process.env.ACCESS_TOKEN_SECRET;
        if (!accessToken)
            throw new UnauthenticatedError(`Invalide accessToken`);
        req.User = jwt.verify(token, accessToken) as AdminAtterbuites;
        next();
    } catch (error) {
        throw new UnauthenticatedError(
            `Not authorized to access this route ${error}`
        );
    }
};

const Sign = (User: AdminAtterbuites): JwtToken => {
    const accesstoken_secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    const refreshtoken_secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;

    if (!accesstoken_secret || !refreshtoken_secret)
        throw new UnauthenticatedError(`Invalide accessToken`);
    const accesToken = jwt.sign(User, accesstoken_secret);
    const RefreshToken = jwt.sign(User, refreshtoken_secret);
    return {
        AccessToken: accesToken,
        RefreshToken: RefreshToken,
    };
}

export { authenticationMiddleware, Sign };
