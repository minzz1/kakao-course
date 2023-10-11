// apiRouter.js
import express from "express";
import { getCourseList, qrCheck } from "../controller/courseController";
import { join, login } from "../controller/userController";
import passport from "passport";

const apiRouter = express.Router();

apiRouter.get("/courses", getCourseList)
apiRouter.post("/courses", qrCheck)

//회원가입
apiRouter.post("/join",join)
apiRouter.post("/login", login)

//카카오로그인
apiRouter.get("/kakao" , passport)


export default apiRouter;
