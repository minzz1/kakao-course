// apiRouter.js
import express from "express";
import { getCourseList, qrCheck } from "../controller/courseController";
import { join } from "../controller/userController";

const apiRouter = express.Router();

apiRouter.get("/courses", getCourseList)
apiRouter.post("/courses", qrCheck)

//회원가입
apiRouter.post("/join",join)

export default apiRouter;
