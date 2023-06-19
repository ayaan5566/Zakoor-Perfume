let express = require("express")
let app = express()

let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//encrypt

async function encrypt(message, key) {
    return new Promise((res, rej) => {
        jwt.sign(message, key, (err, data) => {
            if (err) {
                rej(err)
            }
            res(data)
        })
    })
}

//dcrypt

async function dcrypt(encrypteddata, key) {
    return new Promise((res, rej) => {
        jwt.verify(encrypteddata, key, (err, data) => {
            if (err) {
                rej(err)
            }
            res(data)
        })
    })
}


///hash

async function hash(pt, salt = 10) {
    let encrypt = await bcrypt.hash(pt, salt).catch((error) => {
        return { error }
    });
    if (!encrypt || (encrypt && encrypt.error)) {
        return { error: "error in password encryption" }
    }
    return encrypt
}

//compare

async function compare(pt, et) {
    let check = await bcrypt.compare(pt, et).catch((error) => {
        return { error: "invalid password||password not compared" }
    });
    if (!check || (check && check.error)) {
        return { error: check.error }
    }
    return check
}

module.exports={encrypt,dcrypt,hash,compare}