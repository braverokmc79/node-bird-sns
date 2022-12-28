module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //MYSQL  에는  POST 테이블 생성
        //id: {}, id 가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        //RetweetId
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci' //이모티콘 저장
    });

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); //post.addUser post.getUser , post.setUser
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //post.addHashtags
        db.Post.hasMany(db.Comment); //post.addComments, post.getComments
        db.Post.hasMany(db.Image); //post.addImages . post.getImages
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); //post.addLikers , post.removeLikers
        db.Post.belongsTo(db.Post, { as: "Retweet" }); //post.addReteet
    }
    return Post;
}