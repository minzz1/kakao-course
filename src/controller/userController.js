import bcrypt from "bcrypt";
import db from "../config/db";
import { response } from "express";
import jwt from "jsonwebtoken";

export const join = async (request, response) => {
    const joinData = request.body;
    console.log("들어왔다링");
    
    //id가 중복인지 여부 체크(duplicate id)
    const QUERY1 = `SELECT * FROM users WHERE user_email=?`;
    const user = await db.execute(QUERY1, [joinData.userId])
                        .then((result) => result[0][0])
    if(user) {
        return response.status(400).json({status : "ID 중복"})
    }
    //비밀번호 암호화 라이브러리
    //8번 최소, 12 좀 많음
    //높을수록 암호화 높음, 시간 많이듬 

    const hashPassword = await bcrypt.hash(joinData.userPassword, 8);
    console.log(hashPassword);

    //회원가입
    const QUERY2 = 
       ` INSERT INFO users
            (user_email, user_password, user_name)
        VALUES
            (? ,? ,?)`

    db.execute(QUERY2, [joinData.userId, hashPassword, joinData.userName])


    response.status(201).json({ status : "success"})
}


export const login = async (request, response) => {
    const loginData = request.body; //userId, userPassword

    //1. 들어온 이메일에 해당하는 유저가 있는지 확인
    const QUERY1 = `SELECT * FROM users WHERE user_email = ?`;
    const user = await db.execute(QUERY1, [loginData.userId]).then((result) => result[0][0]);

    if(!user) {
        return response.status(400).json({status : "아이디, 비밀번호 확인"})
    }
    //2. 비밀번호 확인 - DB 비밀번호(암호화), 프론트에서 보낸 비밀번호(1234)
    const isPasswordRight = await bcrypt.compare(loginData.userPassword, user.user_password);
    // True, false
    if(!isPasswordRight) {
        return response.status(400).json({status : "아이디, 비밀번호 확인"});
    }

    //3. json web Token 토큰을 만들어야 함 -> 로그인 유지
    // 서버는 바보야 npm i jsonwebtoken
    jwt.sign({id:user.user_id},"minzz123" , {expiresIn:"30d"}) //3개 넣을 값, 시크릿 값, 만료일
}