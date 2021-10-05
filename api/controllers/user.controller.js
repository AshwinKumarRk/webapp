const db = require("../models");
const User = db.users;
const {v4: uuid} = require('uuid');
const bcrypt = require('bcrypt')

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
    password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

    const user = {
        id: uid,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: password
    }

    User.create(user)
        .then(data => {
            res.send(data);
        })
}

//Update a user's data using unique id
exports.update = (req, res) => {
    const id = req.params.id

    User.findOne({where: {id: id}})
    .then(users => {
        users.firstName = req.body.firstName,
        users.lastName = req.body.lastName
        users.password = req.body.password

        users.save();
        res.status(200).json({
            message: "User data updated successfully!"
        });
    })
}