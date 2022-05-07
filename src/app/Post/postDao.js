// 유저 게시물 조회
async function selectUserPosts(connection, userIdx) {
    const selectUserPostsQuery = `
    SELECT p.postIdx as postIdx,
    pi.imgUrl as postImgUrl
FROM Post as p
    join PostImgUrl as pi on pi.postIdx = p.postIdx and pi.status = 'ACTIVE'
    join User as u on u.userIdx = p.userIdx
WHERE p.status = 'ACTIVE' and u.userIdx = ?
group by p.postIdx
HAVING min(pi.postImgUrlIdx)
order by p.postIdx;  
    `;
    const [userPostsRows] = await connection.query(
        selectUserPostsQuery,
        userIdx
    );

    return userPostsRows;
}

async function selectPosts(connection, userIdx) {
        const selectPostsQuery = `
        SELECT P.*, U.nickName , U.profileImgUrl,
        IF(PL.PostLikeCount IS NULL,0,PL.PostLikeCount) AS PostLikeCount,
        IF(C.CommentCount IS NULL,0,C.CommentCount) AS CommentCount,
        PIU.ImgUrls, PIU.PostImgUrlIdxs

        FROM Post AS P
    inner JOiN (SELECT U.* FROM Follow AS F
    LEFT JOIN User AS U
    ON F.followeeIdx = U.userIdx
    WHERE  F.followerIdx = ?) U
    ON P.userIdx = U.userIdx
    LEFT JOIN (SELECT postIdx,Count(postIdx) AS PostLikeCount FROM PostLike
             WHERE status='ACTIVE'
     GROUP BY postIdx) PL
    ON P.postIdx = PL.postIdx
    LEFT JOIN (SELECT postIdx,COUNT(postIdx) AS CommentCount FROM  Comment
     WHERE status='ACTIVE'
     GROUP BY postIdx) C
    ON P.postIdx = C.postIdx
    LEFT JOIN (SELECT *,GROUP_CONCAT(imgurl ORDER BY postImgUrlIdx) AS ImgUrls,GROUP_CONCAT(postImgUrlIdx ORDER BY postImgUrlIdx) AS PostImgUrlIdxs  FROM PostImgUrl
    WHERE status = 'ACTIVE'
    GROUP BY postIdx) PIU
    ON PIU.postIdx = P.postIdx
    ORDER BY P.createdAt DESC;

        `;
    // const selectPostsQuery = `

    // SELECT P.*, U.nickName , U.profileImgUrl,
    // IF(PL.PostLikeCount IS NULL,0,PL.PostLikeCount) AS PostLikeCount,
    // IF(C.CommentCount IS NULL,0,C.CommentCount) AS CommentCount
    // FROM Post AS P
    // inner JOiN (SELECT U.* FROM Follow AS F
    // LEFT JOIN User AS U
    // ON F.followeeIdx = U.userIdx
    // WHERE  F.followerIdx = ?) U
    // ON P.userIdx = U.userIdx
    // LEFT JOIN (SELECT postIdx,Count(postIdx) AS PostLikeCount FROM PostLike
    //         WHERE status='ACTIVE'
    // GROUP BY postIdx) PL
    // ON P.postIdx = PL.postIdx
    // LEFT JOIN (SELECT postIdx,COUNT(postIdx) AS CommentCount FROM  Comment
    // WHERE status='ACTIVE'
    // GROUP BY postIdx) C
    // ON P.postIdx = C.postIdx
    // ORDER BY P.createdAt DESC;
    // `;

    const [postRows] = await connection.query(selectPostsQuery, userIdx);
    return postRows;
}

//실습자료, (실습따라한거)
async function selectPostImgs(connection, postIdx) {
    const selectPostImgsQuery = `
    SELECT pi.postImgUrlIdx,
    pi.imgUrl
FROM PostImgUrl as pi
join Post as p on p.postIdx = pi.postIdx
WHERE pi.status = 'ACTIVE' and p.postIdx=?;
    
    `;
    const [postImgRow] = await connection.query(selectPostImgsQuery, postIdx);
    return postImgRow;
}

module.exports = {
    selectUserPosts,
    selectPosts,
    selectPostImgs,
};
// join PostImgUrl as pi on pi.postIdx = p.postIdx and pi.status = 'ACTIVE'
// join User as i on u.userIdx = p.userIdx
// WHERE p.status='ACTIVE' and u.userIdx=?
// group by p.postIdx
// HAVING min(pi.postImgUrlInx)
// order by p.postIdx;
