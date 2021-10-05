const db = require("../models");
const User = db.users;
const {
    v4: uuid
} = require('uuid');
const bcrypt = require('bcrypt');
const bAuth = require('basic-auth');
const auth = require("basic-auth");
const validator = require("email-validator");

//Create a user with a unique id
exports.create = (req, res) => {
    const uid = uuid()
    password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

    //Mandatory fields are checked if entered
    if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.password) {
        res.status(400).send("Values of one or more fields are missing. Please enter and try again.")
        return
    }

    //Fields must be unable to edir
    if (req.body.id || req.body.createdAt || req.body.updatedAt) {
        res.status(400).send("ID, creation and updating times cannot be manually entered")
        return
    }

    //Use email-validator to verify if username is a valid e-mail
    if (!validator.validate(req.body.username)) {
        res.status(400).send("Invalid username. Enter valid email id. Example: xxx@xxx.com")
    }

    const user = {
        id: uid,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: password
    }

    User.findOne({
        where: {
            "username": req.body.username
        }
    }).then(users => {
        if (users) {
            res.status(400).send("User already exists.")
            return
        } else {
            User.create(user)
                .then(data => {
                    res.status(201).send("User created successfully!");
                })
        }
    }).catch(err => {
        res.status(500).send("Error")
    })
}

//Retrieve a user with unique id
exports.findOne = (req, res) => {
    const user = auth(req)

    if (!user.name || !user.pass) {
        res.status(403).send("Username / Password required for authentication")
    }

    // const id = req.params.id

    //Verify user by username and password
    User.findOne({
            where: {
                username: user.name
            }
        })
        .then(users => {
            if (users) {
                if (bcrypt.compareSync(user.pass, users.password)) {
                    let userData = {
                        id: users.id,
                        username: users.username,
                        firstName: users.firstName,
                        lastName: users.lastName,
                        account_created: users.createdAt,
                        account_updated: users.updatedAt
                    }
                    res.status(200).send(userData)
                } else {
                    res.status(401).send('Incorrect Username/Password combination')
                    return
                }
            } else {
                res.status(404).send('User does not exist')
                return
            }
        }).catch(err => {
            res.status(500).send('Error')
        })

}

//Update a user's data using unique id
exports.update = (req, res) => {
    // const id = req.params.id
    const user = auth(req)

    if (!user.name || !user.pass) {
        res.status(403).send("Username / Password required for authentication")
    }

    User.findOne({
            where: {
                username: user.name
            }
        })
        .then(users => {
            if (users) {
                if (bcrypt.compareSync(user.pass, users.password)) {
                    if (req.body.id || req.body.username || req.body.createdAt || req.body.updateAt) {
                        res.status(400).send("Some of the fields you are trying to update are restricted")
                    }
                    password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                    users.firstName = req.body.firstName,
                        users.lastName = req.body.lastName
                    users.password = password

                    try {
                        users.save();
                        res.status(200).send("User data updated successfully!");
                    } catch (err) {
                        res.status(500).send(err)
                    }
                } else {
                    res.status(401).send("Incorrect Username/Password combination")
                    return
                }
            } else {
                res.status(404).send('User does not exist')
                return
            }

        }).catch(err => {
            res.status(500).send('Error')
        })
}