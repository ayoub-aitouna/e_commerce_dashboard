import { Request, Response } from "express";
import { AdminAtterbuites } from "../models/Atterbuites/Admin";
import { Sign } from "../middleware/Auth/auth";
const login = async (req: Request, res: Response) => {
    console.log(req.body);
    const Admin = {
        id: 10,
        email: "email@email.com",
        password: "0102120215@@",
        api_token: "0102120215@@",
        created_at: new Date(),
        updated_at: new Date()
    } as AdminAtterbuites;
    const tokens = Sign(Admin);
    res.json(tokens);
}

const refreshToken = async (req: Request, res: Response) => {
    res.json({ msg: "Sorry, Here is Your New Key" });
}

export { login, refreshToken }
