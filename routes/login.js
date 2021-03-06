//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

let getHash = require('../utilities/utils').getHash

var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

//Pull in the JWT module along with out asecret key
let jwt = require('jsonwebtoken')
let config = {
    secret: process.env.JSON_WEB_TOKEN
}

const req = require('request')

/**
 * @api {get} /auth Request to sign a user in the system
 * @apiName GetAuth
 * @apiGroup Auth
 * 
 * @apiHeader {String} authorization "username:password" uses Basic Auth 
 * 
 * @apiSuccess {boolean} success true when the name is found and password matches
 * @apiSuccess {String} message Authentication successful!
 * @apiSuccess {String} token JSON Web Token
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (404: User Not Found) {String} message "User not found"
 * 
 * @apiError (400: Invalid Credentials) {String} message "Credentials did not match"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */ 
router.get("/", (request, response) => {
    if (!request.headers.authorization || request.headers.authorization.indexOf("Basic") === -1) {
        return response.status(401).json({ message: "Missing Authorization Header" })
    }
    // obtain auth credentials from HTTP Header
    const base64Credentials =  request.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii")
    const [email, theirPw] = credentials.split(":")

    if(email && theirPw) {
        let url = `https://team-2-tcss-450-backend.herokuapp.com/resend?email=${email}`
        let theQuery = "SELECT Password, Salt, MemberId FROM Members WHERE Email=$1 AND Verification=$2"
        let values = [email, 1]   
        pool.query(theQuery, values)
            .then(result => { 
                if (result.rowCount == 0) {
                    req(url, function (error, res, body) {
                        if (error) {
                            response.send(error)
                        } else {
                            // pass on everything (try out each of these in Postman to see the difference)
                            response.send(res);
                        }
                    })
                    // response.status(404).send({
                    //     message: "User not verified" 

                    // })
                    return
                }
                let salt = result.rows[0].salt
                //Retrieve our copy of the password
                let ourSaltedHash = result.rows[0].password 

                //Combined their password with our salt, then hash
                let theirSaltedHash = getHash(theirPw, salt)



                //Did our salted hash match their salted hash?
                if (ourSaltedHash === theirSaltedHash ) {
                    //credentials match. get a new JWT
                    let token = jwt.sign({
                        "email": email,
                        memberid: result.rows[0].memberid
                    },

                        config.secret,
                        { 
                            expiresIn: "14 days" // expires in 14 days
                        })
                    //package and send the results
                    response.json({
                        success: true,
                        message: "Authentication successful!",
                        token: token
                    })
                    
                } else {
                    //credentials dod not match
                    response.status(400).send({
                        message: "Credentials did not match: "
                    })
                }
            })
            .catch((err) => {
                //log the error
                //console.log(err.stack)
                response.status(400).send({
                    message: err.detail
                })
            })
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
})

module.exports = router