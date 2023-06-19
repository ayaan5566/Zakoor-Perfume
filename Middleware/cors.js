let express = require("express")
let cors = require("cors")
let app = express()
let helmet = require("helmet")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let whitelist = ["abc", "xyz"];

app.use(cors({
    origin: (origin, cb) => {
        let check = false;
        for (let i of whitelist) {
            if(origin==i){
                check=true;
                break;
            }
        }
        if(check){
            cb(null,true)
        }else{
            cb("error");
        }
    }
}))

app.use(helmet());

app.get("/hello",(req,res)=>{res.send("hello")});
app.listen(3001,()=>{console.log("connected")})
