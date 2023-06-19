let nodemailer = require("nodemailer")


async function mail(mailOption) {
    return new Promise((res, rej) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:"ayaansayed2003@gmail.com",
                pass:"rmzs rdmu phux wrxs"
            }
        })

            transporter.sendMail(mailOption, (error,info)=> {
            if (error){
                rej(error)
            
            }
              res("Mail Send")


            })
    })
}

module.exports={mail}