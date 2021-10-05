const db = require("../models");
const User = db.users;
const {v4: uuid} = require('uuid');
const bcrypt = require('bcrypt');
const bAuth = require('basic-auth');
const auth = require("basic-auth");

//Retrieve a user with unique id
exports.findOne = (req, res) => {
    const user = auth(req)

    if(!user.name || !user.pass){
        res.status(403).send("Username / Password required for authentication")
    }

    // const id = req.params.id

    //Verify user by username and password
    User.findOne({where: {username: user.name}})
    .then(users => {
        if(users){
            if(bcrypt.compareSync(user.pass, users.password)){
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
                res.status(401).send('You are not authorized to access this data')
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
    // const id = req.params.id
    const user = auth(req)

    if(!user.name || !user.pass){
        res.status(403).send("Username / Password required for authentication")
    }

    User.findOne({where: {username: user.name}})
    .then(users => {
        if(users){
            if(bcrypt.compareSync(user.pass, users.password)){
                if(req.body.id || req.body.username || req.body.createdAt || req.body.updateAt){
                    res.status(400).send("Some of the fields you are trying to update are restricted")
                }
                password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                users.firstName = req.body.firstName,
                users.lastName = req.body.lastName
                users.password = password
        
                try{
                    users.save();
                    res.status(200).send("User data updated successfully!");
                } catch(err) {
                    res.status(500).send(err)
                }
            } else {
                res.status(401).send("You are not authorized to access this data")
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

