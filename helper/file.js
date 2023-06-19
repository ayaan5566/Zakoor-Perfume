let fs=require("fs").Promises
let multer=require("multer");


async function parsefile(req,res,options={}){
    let limit=options.size?options.size :1024*5;
    let ext =options.ext?options.ext: /jpg|png|gif/;
    let field=options.field?options.field:null
    if(!field||(field&&field.error)){
        return {error:"please provid field"}
    }
    let file=multer({
        limit,
        fileFilter:(req,file,cb)=>{
            let check=ext.test(file.mimetype);
            if(!check){
                return cb("error")
            }
            return cb(null,true);
        } 
    })
    if(typeof(field)=="string"){
        file=file.single(field);
    }
    else{
        if(typeof(field)=="object"){
            file=file.field(field)
        }
    }
    return new promise((resolve,reject)=>{
        file(req,res,(err)=>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}


module.exports={parsefile}