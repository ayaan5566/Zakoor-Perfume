let { sequelize, Model, DataTypes } = require("../init/dbconfiq")

class Userpermission extends Model { }

Userpermission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "user_permission", modelName: "Userpermission", sequelize: sequelize 
})

module.exports = { Userpermission }