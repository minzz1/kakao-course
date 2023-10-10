import db from "../config/db"

export const getCourseList = async (request, response) => {
    // 로그인했는지 여부를 판단한다 그래서 유저 id를 가져온다 로그인 안했으면 null
    const userId = request.user ? request.user.user_id : null;

    // 데이터 베이스에서 코스 정보와 방문여부를 가져온다.
    const QUERY = `
    SELECT c.*, users_course_id 
    FROM course c 
    LEFT JOIN users_course uc
    ON c.course_id = uc.course_id AND uc.user_id = ?`

    // 데이터베이스 보내는 것
    const courseList = await db.execute(QUERY, [userId])
                                .then((result) => result[0]);

    response.json(courseList); 
}

export const qrCheck = async (request, response) => {
      //TODO 임의로 유저 데이터 만듬
      const userID = 7;


    const qrInfoData = request.body;   
    //검증코드 1 : 들어온 QR코드에 해당되는 코스가 있는지 여부
    const QUERY1 = `SELECT * FROM course WHERE course_qr = ?`
    const course = await db.execute(QUERY1, [qrInfoData.qrCode])
                            .then((result) => result[0][0]);
    if(!course) return response.status(400).json({status : "fail"});

    //검증코드2 : 해당유저 이 코스에 방문한적이 있는지
    const QUERY2 = `SELECT * FROM users_course WHERE user_id = ? AND course_id = ?`
    const userVisited = await db.execute(QUERY2, [userId, course.course_id])
                                .then((result) => result[0][0]);

    if(userVisited) return response.status(400).json({ status : "visited"});

    console.log('성공')

    //검증코드3 (수학) : 반경 100m내에 있을때만 qr코드 찍을 수 있음
    calculateDistance(qrInfoData.latitude, qrInfoData.longitude, course.latitude, courselongitude)


}

// 질문 2 : 왜 경도에 코사인을 적용하는가?
// -지구는 구 모양이므로, 위도가 변함에 따라 경도 1도의 거리도 변합니다.
// 적도 근처에서는 거리가 길지만, 극점으로 갈수록 그 거리는 줄어듭니다.
// -위도에 따른 이 거리의 변화를 반영하기 위해 코사인 값을 적용합니다.


const calculateDistance = ( currentLat, currentLon, targetLat, targetLon) => {
    currentLat = parseInt(currentLat);
    currentLon = parseInt(currentLon);
    targetLat = parseInt(targetLat);
    targetLon = parseInt(targetLon);

    const dLat = (targetLat - currentLat) * 111000 //111km
    const dLon = (targetLon - currentLon) * 111000 * Math.cos(currentLat * (Math.PI / 180));
    return Math.sqrt(dLat * dLon + dLon * dLon)
}