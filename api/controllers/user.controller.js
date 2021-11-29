const db = require("../models");
const User = db.users;
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const auth = require("basic-auth");
const validator = require("email-validator");
var AWS = require('aws-sdk')
const metrics = require("../../metrics");
const logger = require("../../logger");
const config = require("../config");

//Create a user with a unique id
exports.create = (req, res) => {
    metrics.increment("USER_POST")
    let timer_api = new Date()
    let timer_db = new Date()
    const uid = uuid()

    //Encrypting password using bcrypt with 10 salt rounds
    password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

    //Mandatory fields are checked if they are entered
    if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.password) {
        res.status(400).send("Values of one or more fields are missing. Please enter and try again.")
        return
    }

    //Fields must be unable to edited
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

    logger.info("User Search in progress...")
    User.findOne({
        where: {
            "username": req.body.username
        }
    }).then(users => {
        if (users) {
            res.status(400).send("User already exists.")
            return
        } else {
            logger.info("User Creation in progress...")
            User.create(user)
                .then(data => {
                    logger.info("user created");
                    metrics.timing("DB_USER_POST", timer_db)
                    // AWS.config.update({
                    //     region: "us-east-1"
                    //   });
                      logger.info("config done");
                    // var params = { 
                    //     MessageStructure: 'json',
                    //     Message: JSON.stringify({
                    //       "default": JSON.stringify({
                    //         "email": data.username,
                    //         "token": data.id              
                    //       }),
                    //     }),
              
                    //     TopicArn: config.SNS_TOPIC
                    //   };
                      var params = { 
                          Message: 'test',
                          Subject: 'run',
                          TopicArn: config.SNS_TOPIC
                      };
                      logger.info(config.SNS_TOPIC)
                       logger.info("update");
                    let publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
                    publishTextPromise.then(
                        function(data) {
                          logger.info(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                          console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                          console.log("MessageID is " + data.MessageId);
                          let userData = {
                            id: data.id,
                            username: data.username,
                            firstName: data.firstName,
                            lastName: data.lastName
                        }
                        res.status(201).send(userData);
                        }).catch(
                          function(err) {
                            logger.info(`Error in publish`);
                          console.error(err, err.stack);
                          res.status(500).send("Internal server error");
                        });

                    
                })
                logger.info("User has been created!")
        }
        metrics.timing("USER_POST", timer_api)
    }).catch(err => {
        res.status(500).send("Error")
    })
}

//Retrieve a user with basic authentication
exports.findOne = (req, res) => {
    metrics.increment("USER_GET")
    let timer_api = new Date()
    let timer_db = new Date()
    const user = auth(req)

    if (!user.name || !user.pass) {
        res.status(403).send("Username / Password required for authentication")
    }

    //Verify user by username and password
    logger.info("User Search in progress...")
    User.findOne({
            where: {
                username: user.name
            }
        })
        .then(users => {
            if (users) {
                metrics.timing("DB_USER_GET", timer_db)
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
                    metrics.timing("USER_GET", timer_api)
                    logger.info("User Found!")
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

//Update a user's data using basic authentication
exports.update = (req, res) => {
    metrics.increment("USER_PUT")
    let timer_api = new Date()
    let timer_db = new Date()
    const user = auth(req)

    if (!user.name || !user.pass) {
        res.status(403).send("Username / Password required for authentication")
    }

    logger.info("User Search in progress...")
    User.findOne({
            where: {
                username: user.name
            }
        })
        .then(users => {
            if (users) {
                logger.info("User Found")
                if (bcrypt.compareSync(user.pass, users.password)) {
                    if (req.body.id || req.body.username || req.body.createdAt || req.body.updateAt) {
                        res.status(400).send("Some of the fields you are trying to update are restricted")
                        return
                    }

                    if (!req.body.password || !req.body.firstName || !req.body.lastName) {
                        res.status(400).send("Please enter all the required data")
                        return
                    }

                    //Encrypting password using bcrypt with 10 salt rounds
                    password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                    users.firstName = req.body.firstName
                    users.lastName = req.body.lastName
                    users.password = password

                    try {
                        users.save();
                        metrics.timing("DB_USER_PUT", timer_db)
                        res.status(200).send("User data updated successfully!");
                        metrics.timing("USER_PUT", timer_api)
                        logger.info("User successfully updated")
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