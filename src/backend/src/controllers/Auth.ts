import { Request, Response } from "express";
import { AdminAtterbuites } from "../models/Atterbuites/Admin";
import { Sign } from "../middleware/Auth/auth";
import db from "../models";
import { BadRequest, UnauthenticatedError } from "../errors";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequest("invalide request ");
    const admin: AdminAtterbuites = await db.admin.findOne({ where: { email: email } });
    if (!bcrypt.compare(admin.password, password))
        throw new UnauthenticatedError("Invalide passowrd");
    res.json(Sign(admin));
}

const refreshToken = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new UnauthenticatedError("No token provided");
    const token = authHeader.split(" ")[1];
    try {
        const refresh_token_secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;
        if (!refresh_token_secret)
            throw new UnauthenticatedError(`Invalide refresh_token_secret`);
        res.json(Sign(jwt.verify(token, refresh_token_secret) as AdminAtterbuites));
    } catch (error) {
        throw new UnauthenticatedError(
            `Not authorized to access this route ${error}`
        );
    }
}

export { login, refreshToken }
