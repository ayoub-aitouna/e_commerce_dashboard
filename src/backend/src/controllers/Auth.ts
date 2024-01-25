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
        res.status(500).json(err);;
    }

}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader || !authHeader.startsWith("Bearer "))
            throw new BadRequestError({ code: 403, message: "No token provided", logging: true });
        const token = authHeader.split(" ")[1];

        const refresh_token_secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;
        if (!refresh_token_secret)
            throw new BadRequestError({ code: 403, message: "Invalide refresh_token_secret", logging: true });
        console.log(authHeader, token);
        const admin  = jwt.verify(token, refresh_token_secret) as any;
        
        delete admin.iat;
        delete admin.exp;

        console.log(admin);
        res.json(Sign(admin as AdminAtterbuites));
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

export { login, refreshToken }
