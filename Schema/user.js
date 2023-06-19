let { sequelize, Model, DataTypes } = require("../init/dbconfiq")

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp:{
        type:DataTypes.STRING,
        allowNull:true
    }
}, {
    tableName: "user", modelName: "User", sequelize: sequelize 
})

module.exports = { User }