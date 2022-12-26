module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        //id: {}, id 가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        //UserId:1
        //PostId:3
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci' //이모티콘 저장
    });

    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    }
    return Comment;
}