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




module.exports = { category, dlt, restore}