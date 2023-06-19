let { User } = require("../Schema/user");
let joi = require("joi");
let security = require("../helper/security");
let { mail } = require("../helper/mailer");
let otpGenerator = require("otp-generator")
let { Userpermission } = require("../Schema/userpermission");
const { verify } = require("jsonwebtoken");


async function register(params) {
    //joi validation
    let verify = await verifyRegister(params).catch((error) => {
        return { error }
    })
    console.log("ver", verify)
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    //check email id
    let verifyUser = await User.findOne({ where: { email: params.email } }).catch((error) => {
        return { error }
    })
    if (verifyUser) {
        return { error: "internal server error1", status: 500 }
    }
    // encrypt password
    let password = await security.hash(params.password).catch((error) => {
        return { error }
    })
    if (!password || (password && password.error)) {
        return { error: "internal server error2", status: 500 }
    }
    //save encrypted password on db
    params.password = password

    console.log("params", params)
    // create user on db
    let user = await User.create(params).catch((error) => {
        return { error }
    })
    console.log("eroor", user)
    if (!user || (user && user.error)) {
        return { error: "internal server error3" }
    }
    // giving user permission
    let up = { user_id: user.id, permission_id: 1 }
    let Userp = await Userpermission.create(up).catch((error) => {
        return { error }
    })
    console.log("per", Userp)
    if (!Userp || (Userp && Userp.error)) {

        //permission not get then delete user
        let dlt = await User.destroy({ where: { id: user.id } }).catch((error) => {
            return { error }
        })

        if (!dlt || (dlt && dlt.error)) {
            return { error: "contact ADMIN", status: 500 }
        }
        return { error: "user not created", status: 500 }
    }

    // return success
    return { data: "registration successfully", user }
}

//joi validation register
async function verifyRegister(params) {
    let Schema = joi.object({
        name: joi.string().min(2).max(250).required(),
        email: joi.string().min(8).max(50).required(),
        password: joi.string().min(4).max(100).required()
    })
    let Verify = await Schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    console.log("verify", Verify)
    if (!Verify || (Verify && Verify.error)) {
        let msg = [];
        for (let i of Verify.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: Verify.data }
}
///////////////////////////////////////////////////////////////////////////////

async function login(params) {
    let verify = await verifyLogin(params).catch((error) => {
        return { error }
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let user = await User.findOne({ where: { email: params.email } }).catch((error) => {
        return { error }
    })
    if (!user || (user && user.error)) {
        return { error: "user not registered", status: 400 }
    }
    let check = await security.compare(params.password, user.password).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: "invalid password", status: 401 }
    }
    let token = await security.encrypt({ id: user.id }, "1122").catch((error) => {
        return { error }
    })
    if (!token || (token && token.error)) {
        return { error: "token in invalid", status: 401 }
    }
    //    let tokenSave = await User.update( {token : token},{where : {id : user.id} }).catch((error)=>{
    //     return{error}
    //    })
    //    if(!tokenSave||(tokenSave&&tokenSave.error)){
    //     return{error:"token not save",status:500}
    //    }

    return { token, status: 200 }
}
///////joi schema

async function verifyLogin(params) {
    let Schema = joi.object({
        email: joi.string().min(8).max(50).required(),
        password: joi.string().min(4).max(100).required()
    })
    let Verify = await Schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!Verify || (Verify && Verify.error)) {
        let msg = [];
        for (let i of Verify.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: Verify.data }
}
////////////////////////////////////////
///forget password

async function forget(params) {
    let verify = await verifyUser(params).catch((error) => {
        return { error }
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }

    let user = await User.findOne({ where: { email: params.email } }).catch((error) => {
        return { error }
    })
    if (!user) {
        return { error: "email not found", status: 400 }
    }

    let Otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

// console.log("ee",Otp)
    if(!Otp){
        return{error:"internal server error2",status:500}
    }
    let encryptotp = await security.hash(Otp, (salt=10)).catch((error) => {
        return { error }
    })
    // console.log("otp",encryptotp)
    if (!encryptotp || (encryptotp && encryptotp.error)) {
        return { error: "server error1", status: 500 }
    }
    user.otp = encryptotp

    let result = await user.save().catch((error) => {
        return { error }
    })
// console.log("ee",result)
    if (!result || (result && result.error)) {
        return { error: "not save", status: 500 }
    }

    let mailOption = {
        from: "ayaansayed2003@gmail.com",
        to: user.email,
        sub: "forget password",
        text: `this is your ${Otp}`
    }

    let send = await mail(mailOption).catch((error) => {
        return { error }
    })
    // console.log("ee",send)
    if (!send || (send && send.error)) {
        return { error: "otp not send", status: 500 }
    }
    return { data: send }
}

async function verifyUser(params) {
    let Schema = joi.object({
        email: joi.string().min(8).max(55).required()
    })

    let Verify = await Schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!Verify || (Verify && Verify.error)) {
        let msg = [];
        for (let i of Verify.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: Verify.data }
}



async function resetpassword(params){
    let verify=await Verifyresetpassword(params).catch((error)=>{
        return{error}
    })
    // console.log("ee",verify)
    if(!verify||(verify&&verify.error)){
        return{error:verify.error,status:400}
    }
    let user=await User.findOne({where:{email:params.email}}).catch((error)=>{
        return{error}
    })
    
    if(!user){
        return{error:"email not found",status:400}
    }
      let check=await security.compare(params.otp.toString(),user.otp).catch((error)=>{
        return{error}
      })
      if(!check||(check&&check.error)){
        console.log("ee",check.error)
        return{error:"invalid otp",status:401}
      }

      let encryptpassword=await security.hash(params.password).catch((error)=>{
        return{error}
      })

      if(!encryptpassword||(encryptpassword&&encryptpassword.error)){
        return{error:"server fault",status:500}
      }
     
       let update = await User.update({password :encryptpassword , otp : null },{where : {email : user.email}}).catch((error)=>{
        return{error}
       })
    if(!update||(update&&update.error)){
        return{error:"not updated",status:500}
    }
      
      return{data:"reset password successfully",status:200}
    }


    async function Verifyresetpassword(params) {
    let Schema = joi.object({
        email: joi.string().min(8).max(55).required(),
        otp: joi.string().min(6).required(),
        password:joi.string().min(2).max(555).required()

        
         
    })

    let Verify = await Schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!Verify || (Verify && Verify.error)) {
        let msg = [];
        for (let i of Verify.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: Verify.data }
}



module.exports = { register, login, forget, resetpassword }
