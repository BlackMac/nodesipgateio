const sipgate = require("./sipgate.js")
const config = require("./config.js")
const io = sipgate()

io.login(config.username, config.password)
    .then( io.user )
    .then( user => io.smsIds(user.id) )
    .then( smsIds => io.sms(smsIds[0].id, "4915121234567", "Hallo Welt 👻") )
    .catch((error) => {
        console.log(error)
    })

