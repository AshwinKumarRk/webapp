const db = require("../models");
const User = db.users;
const {v4: uuid} = require('uuid');

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