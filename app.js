const express = require("express")
const app = express()

const userRoute = require('./api/routes/user.route')

app.listen(3000, () => {
    console.log("Connected");
})

app.use('/users', userRoute)