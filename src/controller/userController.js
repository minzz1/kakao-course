import bcrypt from "bcrypt";
import db from "../config/db";

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

    response.status(201).json({ status : "success"})
}