import { Request, Response, NextFunction } from "express";
import { AdminAtterbuites } from "../models/Atterbuites/Admin";
import { Sign } from "../middleware/Auth/auth";
import db from "../models";
import { BadRequestError, CustomError } from "../errors";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("GOT REQUEST");
        console.table(req.body);
        const { email, password } = req.body;
        if (!email || !password)
            throw new BadRequestError({ code: 403, message: "email & password are required!", logging: true });
        const adminres = await db.admin.findOne({ where: { email: email } });
        if (!adminres)
            throw new BadRequestError({ code: 403, message: "email is incorrect!", logging: true })
        const admin: AdminAtterbuites | undefined = adminres.dataValues;
        if (!admin)
            throw new BadRequestError({ code: 403, message: "email is incorrect!", logging: true })
        if (!await bcrypt.compare(password, admin.password))
            throw new BadRequestError({ code: 403, message: "password is incorrect!", logging: true });
        return res.json(Sign(admin));
    } catch (err) {
        next(err);
    }

}

const refreshToken = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new BadRequestError({ code: 403, message: "No token provided", logging: true });
    const token = authHeader.split(" ")[1];
    try {
        const refresh_token_secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;
        if (!refresh_token_secret)
            throw new BadRequestError({ code: 403, message: "Invalide refresh_token_secret", logging: true });
        res.json(Sign(jwt.verify(token, refresh_token_secret) as AdminAtterbuites));
    } catch (error) {
        throw new BadRequestError({ code: 403, message: `Not authorized to access this route ${error}`, logging: true });
    }
}

export { login, refreshToken }
