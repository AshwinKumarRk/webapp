const db = require("../models");
const User = db.users;
const {v4: uuid} = require('uuid');

//Retrieve a user with unique id
exports.findOne = (req, res) => {
    const id = req.params.id

    User.findOne({where: {id: id}})
    .then(users => {
        let userData = {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            account_created: users.createdAt,
            account_updated: users.updateAt
        }
        res.status(200).send(userData)
    })

}

//Create a user with a unique id
exports.create = (req, res) => {
    const uid = uuid()

    const user = {
        id: uid,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    }

    User.create(user)
        .then(data => {
            res.send(data);
        })
}