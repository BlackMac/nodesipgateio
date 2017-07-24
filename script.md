    # npm add express --save

-

    const express = require("express")

    const app = express()

    app.get('/', (req, res) => {
        res.send("Welcome to sipgate")
    })

    app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
    })