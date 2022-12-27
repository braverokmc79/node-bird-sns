exports.isLoggedIn = (req, res, next) => {
    // 패스포트에서 isAuthenticated 를 제공한다
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
}


exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }

}