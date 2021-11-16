const db = require("../models");
const File = db.files;
const User = db.users;
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const auth = require("basic-auth");
const s3 = require('../s3.config');
const { s3Client } = require("../s3.config");
const metrics = require("../../metrics")
const logger = require("../../logger")

exports.createFile = async (req, res) => {
    metrics.increment("FILE_POST")
    const userAuth = auth(req);
    const params = s3.Parameters
    params.Body = req.body
    let timer_api = new Date()
    let timer_db = new Date()
    let timer_s3 = new Date()
    let uid = uuid();

    if (!userAuth.name || !userAuth.pass) {
        return res.status(403).send("Username / Password required for authentication");
    }

    logger.info("User Search in progress...")
    User.findOne({
        where: {
            username: userAuth.name
        }
    }).then(async user => {
        if (user) {
            logger.info("User Found!")
            if (bcrypt.compareSync(userAuth.pass, user.password)) {
                File.findOne({
                    where: {
                        user_id: user.user_id
                    }
                }).then(file => {
                    s3Client.deleteObject({
                        Key: file.dataValues.s3_object_name,
                        Bucket: process.env.S3_BUCKET
                    }, (err, data) => {
                        if (err) {
                            res.status(500).send("Unable to connect to AWS S3");
                            return;
                        } else {
                            file.destroy();
                            return res.sendStatus(204);
                        }
                    })
                })

                logger.info("File upload in progress...")
                await File.create({
                    file_id: uid,
                    file_name: user.id + ".jpeg",
                    s3_object_name: process.env.S3_BUCKET + "/" + user.id + ".jpeg",
                    user_id: user.id
                }).then(file => {
                    metrics.timing("DB_FILE_POST", timer_db)
                    params.Key = file.dataValues.s3_object_name
                })

                await s3Client.upload(params, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    File.findOne({
                        where: {
                            file_id: uid
                        }
                    }).then(file => {
                        metrics.timing("FILE_UPLOAD_TO_S3")
                        let fileData = {
                            id: file.dataValues.file_id,
                            file_name: file.dataValues.file_name,
                            url: file.dataValues.s3_object_name,
                            user_id: file.dataValues.user_id,
                            upload_date: (file.dataValues.createdAt).toISOString().split('T')[0]
                        }
                        res.send(fileData);
                    })
                });
                logger.info("File upload complete!")
                metrics.timing("FILE_POST", timer_api)
            } else {
                res.status(401).send("Incorrect Credentials")
            }
        } else {
            res.status(404).send("User Not Found")
        }
    })
}

exports.deleteFile = (req, res) => {
    metrics.increment("FILE_DELETE")
    let timer_api = new Date()
    let timer_db = new Date()

    const userAuth = auth(req);

    if (!userAuth.name || !userAuth.pass) {
        return res.status(403).send("Username / Password required for authentication");
    }

    logger.info("User Search in progress...")
    User.findOne({
        where: {
            username: userAuth.name
        }
    }).then(user => {
        if (user) {
            logger.info("User Found!")
            if (bcrypt.compareSync(userAuth.pass, user.password)) {
                File.findOne({
                    where: {
                        user_id: user.id
                    }
                }).then(file => {
                    logger.info("File deletion in progress...")
                    s3Client.deleteObject({
                        Key: file.dataValues.s3_object_name,
                        Bucket: process.env.S3_BUCKET
                    }, (err, data) => {
                        if (err) {
                            // console.log(err);
                            res.sendStatus(500);
                            return;
                        } else {
                            file.destroy();
                            metrics.timing("DB_FILE_DELETE", timer_db)
                            logger.info("File deletion complete!")
                            metrics.timing("FILE_DELETE", timer_api)
                            return res.sendStatus(204);
                        }
                    })
                })

            } else {
                res.status(401).send("Incorrect Credentials")
            }
        } else {
            res.status(404).send("User not found")
        }
    })
}

exports.findFile = (req, res) => {
    metrics.increment("FILE_GET")
    let timer_api = new Date()
    let timer_db = new Date()
    const userAuth = auth(req);

    if (!userAuth.name || !userAuth.pass) {
        return res.status(403).send("Username / Password required for authentication");
    }

    logger.info("User search in progress...")
    User.findOne({
        where: {
            username: userAuth.name
        }
    }).then(user => {
        if (user) {
            logger.info("User Found")
            if (bcrypt.compareSync(userAuth.pass, user.password)) {
                File.findOne({
                    where: {
                        user_id: user.id
                    }
                }).then(file => {
                    metrics.timing("DB_FILE_GET", timer_db)
                    logger.info("File found!")
                    let fileData = {
                        id: file.dataValues.file_id,
                        file_name: file.dataValues.file_name,
                        url: file.dataValues.s3_object_name,
                        user_id: file.dataValues.user_id,
                        upload_date: (file.dataValues.createdAt).toISOString().split('T')[0]
                    }
                    metrics.timing("FILE_GET", timer_api)
                    res.send(fileData);
                })

            } else {
                res.status(400).send("Incorrect Password")
            }
        } else {
            res.status(500).send("User not found")
        }
    })
}
