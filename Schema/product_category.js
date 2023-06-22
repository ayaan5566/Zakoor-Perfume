let {sequelize,Model,DataTypes}=require("../init/dbconfiq")

class Product_category extends Model{}

Product_category.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    tableName:"product_category",modelName:"Product_category",sequelize:sequelize
})


module.exports={Product_category}