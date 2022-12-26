module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //MYSQL  에는  users 테이블 생성
        //id: {}, id 가 기본적으로 들어있다.
        email: {
            type: DataTypes.STRING(30),//STRING,TEXT,BOOLEAN,INTEGER,FLOAT,DATETIME
            allowNull: false, //필수,
            unique: true, //고유한 값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false, //필수
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,//필수
        }

        //PostId:1,2,5,10,15
        //CommentId

    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: "FollowingId" });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: "FollowerId" });
    };

    return User;
}
