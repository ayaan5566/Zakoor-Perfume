let{sequelize,Model,DataTypes,}=require("../init/dbconfiq")

class Category extends Model{}

Category.init({
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
    p_id: {
        type:DataTypes.INTEGER,
        allowNull:false,

    },
    created_by:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    updated_by:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
},{
    tableName:"category",modelName:"Category",sequelize:sequelize
});


module.exports={Category}