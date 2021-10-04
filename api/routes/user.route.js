const { Router } = require("express");
const router = Router()
const users = require('../controllers/user.controller')

//Route to navigate to requests
router.post('/', users.create)

module.exports = router
