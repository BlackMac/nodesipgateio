const request = require("request")
const apiserver = 'https://api.sipgate.com/v2/'

module.exports = () => {
    var sessionToken = null
    var userName = null

    var getAuthToken = (user, password) => {
        return new Promise((resolve, reject) => {
            userName = user
            request({
                url:apiserver+"authorization/token",
                method: 'POST',
                body: {
                    'username':user,
                    'password':password
                },
                json: true
            }, (error, response, body) => {
                if (error) {
                    return reject(new Error(error))
                }
                if (!body.token) {
                    return reject(new Error("No Token returned"))
                }
                sessionToken = body.token
                
                return resolve(sessionToken)
            })
        }) 
    }

    module.login = (user, password) => {
        return getAuthToken(user, password)
    }

    module.user = () => {
        return new Promise((resolve, reject) => {
            var activeUser = null
            module.users().then((res) => {
                res.forEach((user) => {
                    if (user.email === userName) {
                        activeUser = user
                    }
                })
                if (!activeUser) return reject(new Error("Could not identify user"))
                return resolve(activeUser)
            })
        })
    }

    module.users = () => {
        return new Promise((resolve, reject) => {
            if (!sessionToken) return reject(new Error("You need to call .login() first"))
            request({
                url: apiserver+"users",
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                },
                json: true
            }, (error, response, body) => {
                if (error) return reject(new Error(error))
                if (response.statusCode !== 200) return reject(new Error("HTTP Error: " + response.statusCode + " " + response.statusMessage))
                if (!Array.isArray(body.items)) return reject(new Error("Invalid type for items: " + typeof body.items))
                return resolve(body.items)
            })
        })
    }

    module.smsIds = (userId) => {
        return new Promise((resolve, reject) => {
            if (!sessionToken) return reject(new Error("You need to call .login() first"))
            request({
                url: apiserver + userId + '/sms',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                },
                json: true
            }, (error, response, body) => {
                if (error) return reject(new Error(error))
                if (response.statusCode !== 200) return reject(new Error("HTTP Error: " + response.statusCode + " " + response.statusMessage))
                if (!Array.isArray(body.items)) return reject(new Error("Invalid type for items: " + typeof body.items))
                return resolve(body.items)
            })
        })
    }

    module.sms = (smsId, recipient, content) => {
        return new Promise((resolve, reject) => {
            if (!sessionToken) return reject(new Error("You need to call .login() first"))
            request({
                url: apiserver+"sessions/sms",
                method: 'POST',
                body: {
                    'smsId': smsId,
                    'recipient': recipient,
                    'message': content
                },
                headers: {
                    'Authorization': 'Bearer ' + sessionToken
                },
                json: true
            }, (error, response, body) => {
                if (error) return reject(new Error(error))
                if (response.statusCode !== 204) return reject(new Error("HTTP Error: " + response.statusCode + " " + response.statusMessage))
                return resolve()
            })
        })
    }

    return module
}