let express=require("express");
let app=express();

let routes=require("./routes")

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(routes.app)

// let db=require("./init/dbconfiq")

app.listen(3001,()=>{
    console.log("connected")
})