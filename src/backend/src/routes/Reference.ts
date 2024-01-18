import { Router } from "express";
import {
    GetReference,
    PostReference,
    UpdateReference,
    deleteReferece,
    SearchReference,
    GetReferenceDns,
    GetReferenceSite
} from "../controllers/Reference";

const ReferenceRouter = Router();

ReferenceRouter.post("/", PostReference);
ReferenceRouter.get("/", GetReference);
ReferenceRouter.put("/:id", UpdateReference);
ReferenceRouter.delete("/:id", deleteReferece);
ReferenceRouter.get("/Search", SearchReference);
ReferenceRouter.get("/dns", GetReferenceDns);
ReferenceRouter.get("/site", GetReferenceSite);

export default ReferenceRouter;