module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //MYSQL  에는  POST 테이블 생성
        //id: {}, id 가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci' //이모티콘 저장
    });

    Post.associate = (db) => { }
    return Post;
}