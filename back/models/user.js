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

    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });
    User.associate = (db) => { }
    return User;
}