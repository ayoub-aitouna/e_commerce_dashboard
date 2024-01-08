import { Router, Request, Response } from "express";
// import  from "@/controllers/Auth";
import { login, refreshToken } from "../controllers/Auth";
const AuthRouter = Router();


AuthRouter.post("/", login);
AuthRouter.get("/refreshtoken", refreshToken);

export default AuthRouter;