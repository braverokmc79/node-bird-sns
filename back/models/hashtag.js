module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        //id: {}, id 가 기본적으로 들어있다.
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci' //이모티콘 저장
    });

    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post);
    }
    return Hashtag;
}