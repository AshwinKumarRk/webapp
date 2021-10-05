const express = require("express")
const bodyParser = require('body-parser')
const db = require("./api/models");
const userRoute = require('./api/routes/user.route')
const app = express()

require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, () => {
    console.log("Connected");
})

app.use('/users', userRoute)

db.sequelize.sync();