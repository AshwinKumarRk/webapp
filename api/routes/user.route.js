const { Router } = require("express");
const router = Router()

router.get('/', (req, res) => {
    res.send("Handling GET request")
})

router.post('/', (req, res) => {
    res.send("Handling POST request")
})

module.exports = router
