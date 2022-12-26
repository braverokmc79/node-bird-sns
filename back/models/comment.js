module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        //id: {}, id 가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci' //이모티콘 저장
    });

    Comment.associate = (db) => { }
    return Comment;
}