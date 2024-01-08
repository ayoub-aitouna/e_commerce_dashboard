import { Request } from "express"
import { AdminAtterbuites } from "@/models/Atterbuites/Admin"

export interface JwtRequest extends Request {
    User?: AdminAtterbuites;
}