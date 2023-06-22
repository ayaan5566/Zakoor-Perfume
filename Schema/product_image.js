let {sequelize,Model,DataTypes}=require("../init/dbconfiq")


class Product_image extends Model{}

Product_image.init({
     id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
     },
     file_name:{
        type:DataTypes.STRING,
        allowNull:false
     },
     file_ext:{
        type:DataTypes.STRING,
        allowNull:false
     },
     created_by:{
        type:DataTypes.INTEGER,
        allowNull:true
     },
     updatedAt:{
        type:DataTypes.INTEGER,
        allowNull:true
     },
     createdAt:{
        type:DataTypes.INTEGER,
        allowNull:true
     }
},{
    tableName:"product_image",modelName:"Product_image",sequelize:sequelize
})


module.exports={Product_image}