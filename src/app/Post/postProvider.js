const { pool } = require("../../../config/database");
const postDao = require("./postDao");

exports.retrieveUserPosts = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userPostsResult = await postDao.selectUserPosts(connection, userIdx);

    connection.release();
    return userPostsResult;
};

exports.retrievePostLists = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postListsResult = await postDao.selectPosts(connection, userIdx);
    // console.log(postListsResult);

    /*
    5주차과제로 구현한것 .
    데이터베이스서버에서 한번만 호출
    서버에서 정보가공
    */

    for (post of postListsResult) {
        post.test = [];
        post.ImgUrls = post.ImgUrls?.split(",");
        post.PostImgUrlIdxs = post.PostImgUrlIdxs?.split(",");

        post.ImgUrls?.map((x, y) => {
            post.test = [
                ...post.test,
                { imgurl: x, index: Number(post.PostImgUrlIdxs[y]) },
            ];
        });
        post.ImgUrls = post.test;
        delete post.test;
        delete post.PostImgUrlIdxs;
    }

    /*
    8주차 강의 실습내용
    */
    // for (post of postListsResult) {
    //     const postIdx = post.postIdx;
    //     const postImgUrlsResult = await postDao.selectPostImgs(
    //         connection,
    //         postIdx
    //     );
    //     post.imgUrls = postImgUrlsResult;
    // }

    connection.release();
    return postListsResult;
};
