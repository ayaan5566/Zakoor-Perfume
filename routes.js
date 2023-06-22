let express=require("express")
let app=express();
let controller=require("./Controller/categorycon");
let  authController = require ("./Controller/authcon");
let {auth}  = require("./Middleware/authmiddle");

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/demo",auth("user"),(req,res)=>{res.send(req.userData)})


app.post("/register",authController.register);
app.post("/login",authController.login);
app.post("/forget",authController.forget);
app.post("/reset",authController.reset);



app.post("/category",auth("add_category"),controller.category);
app.delete("/category/:id",auth("delete_category"),controller.dlt);
app.put("/category/:id",auth("restore_category"),controller.restore)
app.get("/category/viewall/:id",auth("viewall_category"),controller.viewall)
app.get("/category/viewsingle/:id",auth("view_category"),controller.viewsingle)
app.put("/category/updatecategory/:id",auth("update_category"),controller.updatecategory)



module.exports={app}
