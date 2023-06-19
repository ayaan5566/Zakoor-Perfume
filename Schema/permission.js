let { sequelize, Model, DataTypes } = require("../init/dbconfiq")

class Permission extends Model { }

Permission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "permission", modelName: "Permission", sequelize: sequelize 
})

module.exports = { Permission }