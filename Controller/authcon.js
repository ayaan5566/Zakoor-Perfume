let auth = require("../Model/authModel")


async function register(req, res) {
    let data = await auth.register(req.body).catch((error) => {
        return { error }
    })
    console.log("h1",data)
    if (!data || (data && data.error)) {
        let error = (data && data.error) ?
            data.error : "internal server error"
        
        return res.status(500).send({ error })
    }
    return res.status(200).send({data:data.data})
}


async function login(req,res){
    let data=await auth.login(req.body).catch((error)=>{
        return{error}
    })
    console.log("data",data)
    if(!data||(data&&data.error)){
        let error=(data&&data.error)?data.error:"internal server error"
        
        return res.status(500).send({error})
    }
    return res.status(200).send(data)
}



async function forget(req,res){
    let data = await auth.forget(req.body).catch((error)=>{
        return{error}
    })
    if(!data||(data&&data.error)){
        let error=(data&&data.error)?data.error:"server error"
console.log("data",error)
        return res.status(500).send({error})
    }
    return res.status(200).send(data)

}

async function reset(req,res){
    let data = await auth.resetpassword(req.body).catch((error)=>{
        return{error}
    })

    if(!data||(data&&data.error)){
        let error=(data&&data.error)?data.error:"server error"
console.log("err",data.error)
        return res.status(500).send({error})
    }
    return res.status(200).send(data)

}






module.exports={register,login,forget,reset}