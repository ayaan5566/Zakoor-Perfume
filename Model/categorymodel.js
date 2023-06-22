let { Category } = require("../Schema/categoryschema")

let joi = require("joi")
let security = require("../helper/security")
const { verify } = require("jsonwebtoken")
const { useInflection } = require("sequelize")
const { User } = require("../Schema/user")


async function addcategory(params, userData) {

    let verify = await verifycategory(params).catch((error) => {
        return { error }
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }

    if (params.p_id) {
        let verifyUser = await Category.findOne({ where: { id: params.p_id } }).catch((error) => {
            return { error }
        })
        if (!verifyUser || verify.error) {

            return { error: "category not found", status: 400 }
        }
        let cat = await Category.findOne({ where: { p_id: params.p_id, name: params.name } }).catch((error) => {
            return { error }
        })
        if (cat) {
            return { error: "already created", status: 400 }
        }
    }




    params["created_by"] = userData.id
    params["updated_by"] = userData.id

    let add = await Category.create(params).catch((error) => {
        return { error }
    })
    if (!add || (add && add.error)) {
        return { error: "not add in db", status: 500 }
    }
    return { data: add }
}

async function verifycategory(params) {
    let Schema = joi.object({
        name: joi.string().min(2).max(250).required(),
        p_id: joi.number()

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

///////delete category
async function deleteandrestore(params, userData, decision) {
    let data = await verifydata(params).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        return { error: "data not verify", status: 400 }
    }
    if (params.id) {
        let verifyUser = await Category.findOne({ where: { id: params.id } }).catch((error) => {
            return { error }
        })
        if (!verifyUser || (verifyUser && verifyUser.error)) {
            return { error: "not found", status: 401 }
        }
        params["created_by"] = userData.id
        params["updated_by"] = userData.id
        params["updated_At"] = Date.now();

        let cat = await Category.update({ is_deleted: decision, updated_by: userData.id }, { where: { id: params.id } }).catch((error) => {
            return { error }
        })
        if (!cat) {
            return { error: "not update", status: 500 }
        }
        return { data: cat }
    }
}

async function verifydata(params) {
    let Schema = joi.object({
        id: joi.number().required()
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



async function viewall(params, userData) {
    let verify = await viewverify(params).catch((error) => {
        return { error }
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let record = (params.record) ? params.record : 10
    let page = (params.page) ? params.page : 1
    let offset = record * (page - 1);

    let where = {}
    if (params.cat) {
        where["name"] = { [op.like]: `${params.cat}%` }
    }
    let count = await Category.count({ where }).catch((error) => {
        return { error }
    })
    if (!count || (count && count.error)) {
        return { error: "internal error", status: 500 }
    }
    if (count <= 0) {
        return { data: { total: count, page, record } }
    }

    let categories = await Category.findAll({ where: where, limit: record, offset: offset }).catch((error) => {
        return { error }
    })
    if (!categories || (categories && categories.error)) {
        return { error: "not found", status: 404 }
    }
    return { total: count, page, record, data: categories }
}
async function viewverify(params) {
    let Schema = joi.object({
        page: joi.number().allow(""),
        cat: joi.string().allow(""),
        record: joi.number().allow("")
    })
    let Verify = await Schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!Verify || (Verify && Verify.error)) {
        let msg = [];
        for (let i of Verify.error) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: Verify.data }
}



async function viewsingle(params) {
    let verify = await viewverify(params).catch((error) => {
        return { error }
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error, status: 400 }
    }
    let category = await Category.findOne({ where: { id: params.id } }).catch((error) => {
        return { error }
    })
    if (!category || (category && category.error)) {
        return { error: "not found", status: 500 }
    }
    return { data: category }
}

async function viewverify(params) {
    let Schema = joi.object({
        id: joi.number().allow("")
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


async function updatecategory(id, params, userData) {
    params["id"] = id
    let verify = await verifyupdate(params).catch((error) => {
        return { error }
    })
    // console.log(verify)
    if (!verify || (verify && verify.error)) {

        return { error: verify.error, status: 400 }
    }

    let category = await Category.findOne({ where: { id: id } }).catch((error) => {
        return { error }
    })
    if (!category || (category && category.error)) {
        return { error: "not find", status: 500 }
    }

    if (params.p_id) {
        let check = await Category.findOne({ where: { id: params.p_id } }).catch((error) => {
            return { error }
        })
        if (!check | (check && check.error)) {
            return { error: "not check", status: 500 }
        }
    }

    params["updated_by"] = userData.id
    let update = await Category.update(params, { where: { id: id } }).catch((error) => {
        return { error }
    })
    if (!update || (update && update.error)) {
        return { error: "not updated", status: 500 }
    }

    return { data: update }

}

async function verifyupdate(params) {
    let Schema = joi.object({
        name: joi.string().min(4).max(500).required(),
        id: joi.number().required(),
        p_id: joi.number()
    })
    let Verify = await Schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    console.log(Verify.error)

    if (!Verify || (Verify && Verify.error)) {
        let msg = [];
        for (let i of Verify.error.details) {
            msg.push(i.message)
            // console.log(i.message)
        }
        return { error: msg }
    }
    return { data: Verify.data }
}





module.exports = { addcategory, deleteandrestore, viewall, viewsingle, updatecategory }