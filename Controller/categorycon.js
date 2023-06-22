let auth = require("../Model/categorymodel")

async function category(req, res) {
    let data = await auth.category(req.body, req.userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.status(200).send(data)
}


async function dlt(req, res) {
    let data = await auth.deleteandrestore(req.params, req.userData, decision = 1).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.status(200).send(data)
}


async function restore(req, res) {
    let data = await auth.deleteandrestore(req.params, req.userData, decision = 0).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.status(200).send(data)
}


async function viewall(req,res){
    let data=await auth.viewall(req.query,req.userData).catch((error)=>{
        return{error}
    })
    if(!data||(data&&data.error)){
        let error=(data&&data.error)?data.error:"internal server error"
        let status=(data&&data.status)?data.status:500
        return res.status(status).send({error})
        }
        return res.status(200).send(data)
} 


async function viewsingle(req,res){
    let data=await auth.viewsingle(req.params,req.userData).catch((error)=>{
        return{error}
    })
    if(!data||(data&data.error)){
        let error=(data&&data.error)?data.error:"server error"
        let status=(data&&data.status)?data.status:500
        return res.status(status).send({error})
    }
    return res.status(200).send(data)
}


async function updatecategory(req,res){
    let data=await auth.updatecategory(req.params.id,req.body,req.userData).catch((error)=>{
        return{error}
    })
    console.log("ee",data)
    if(!data||(data&&data.error)){
        let error=(data&&data.error)?data.error:"server error"
        let status=(data&&data.status)?data.status:500
        return res.status(status).send({error})
    }
    return res.status(200).send(data)
}



module.exports = { category, dlt, restore,viewall,viewsingle,updatecategory}