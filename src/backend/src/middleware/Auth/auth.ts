import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express"
import { JwtRequest } from "../../types/JwtRequest"
import { JwtToken } from "../../types/JwtToken"
import { AdminAtterbuites } from "../../models/Atterbuites/Admin"
import { BadRequestError } from "../../errors";
require("dotenv").config();

const authenticationMiddleware = async (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new BadRequestError({ code: 403, message: "No token provided", logging: true });

    const token = authHeader.split(" ")[1];

    try {
        const accessToken: string | undefined = process.env.ACCESS_TOKEN_SECRET;
        if (!accessToken)
            throw new BadRequestError({ code: 403, message: "Invalide accessToken", logging: true });
        req.User = jwt.verify(token, accessToken) as AdminAtterbuites;
        res.status(500).json();
    } catch (error) {
        throw new BadRequestError({ code: 401, message: `Not authorized to access this route ${error}`, logging: true });
    }
};

const Sign = (User: AdminAtterbuites): JwtToken => {
    const accesstoken_secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    const refreshtoken_secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;

    if (!accesstoken_secret || !refreshtoken_secret)
        throw new BadRequestError({ code: 403, message: `Invalide accessToken`, logging: true });

    return {
        AccessToken: jwt.sign(User, accesstoken_secret, { expiresIn: '1m' }),
        RefreshToken: jwt.sign(User, refreshtoken_secret, { expiresIn: '7d' }),
    };
}

export { authenticationMiddleware, Sign };
