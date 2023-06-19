let { Sequelize,Model,DataTypes,QueryTypes}=require("sequelize")
let sequelize=new Sequelize("mysql://root:@localhost/demo")

sequelize.authenticate().then((d)=>{
    console.log("Connected to Db")
}).catch((err)=>{
    console.log("error in dbconnection")
})

module.exports={sequelize,Model,DataTypes,QueryTypes}