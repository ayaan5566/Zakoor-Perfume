// const { QueryTypes } = require("sequelize");
let security = require("../helper/security");
let { sequelize,QueryTypes } = require("../init/dbconfiq");


function auth(Permission) {
    return async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(401).send({ error: "unautorized request1" })
        }
        let dcrypt = await security.dcrypt(req.headers.token, "1122").catch((error) => {
            return { error }
        })
        if (!dcrypt || (dcrypt && dcrypt.error)) {
            console.log("auth middleware" , dcrypt.error)
            return res.status(401).send({ error: "unautorized request2" })
        }
        let user = await sequelize.query(`Select
        user.id,user.name,p.name as permission,email
        from user 
        left join user_permission as up
        on user.id=up.user_id
        left join permission as p
        on up.permission_id=p.id
        where user.id=:key`, {
            replacements: { key: dcrypt.id},
            type: QueryTypes.SELECT

        }).catch((error) => {
            return { error }
        })
        // console.log("user", dcrypt, user)
        if (!user || (user && user.error)) {
            return res.status(400).send({ error: "bad request1" });
        }
        let permissions = {}
        for (let i of user) {
            permissions[i.permission] = true;
        }
        if (!permissions[Permission]) {
            return res.status(400).send({ error: "Bad request2" })
        }
        // console.log("err",permissions)
        req.userData = {
            id: user[0].id, name: user[0].name, email: user[0].email,
            permissions
        }
        next();
    }

}


module.exports = { auth }