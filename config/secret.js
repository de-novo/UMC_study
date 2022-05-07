// TODO: 해당 KEY 값들을 꼭 바꿔서 사용해주세요!
// TODO: .gitignore에 추가하는거 앚지 마세요!
require('dotenv').config()

module.exports = {
    'jwtsecret' :  process.env.JWT_SCRERET,
};