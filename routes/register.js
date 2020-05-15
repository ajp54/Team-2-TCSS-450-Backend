//express is the framework we're going to use to handle requests
const express = require('express')

//We use this create the SHA256 hash
const crypto = require("crypto")

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

let getHash = require('../utilities/utils').getHash

let sendEmail = require('../utilities/utils').sendEmail

var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {post} /register Request to resgister a user
 * @apiName PostAuth
 * @apiGroup Auth
 * 
 * @apiParam {String} first a users first name
 * @apiParam {String} last a users last name
 * @apiParam {String} email a users email *required unique
 * @apiParam {String} password a users password
 * 
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {String} email the email of the user inserted 
 * 
 * @apiError (400: Invalid first name) {String} message "Invalid first name information"
 * 
 * @apiError (400: Invalid email) {String} message "Invalid email registration information"
 * 
 * @apiError (400: Invalid password) {String} message "Invalid password registration information"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: Username exists) {String} message "Username exists"
 * 
 * @apiError (400: Email exists) {String} message "Email exists"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */ 
router.post('/', (req, res) => {
    res.type("application/json")

    //Retrieve data from query params
    var first = req.body.first
    var last = req.body.last
    var username = req.body.email //username not required for lab. Use email
    var email = req.body.email
    var password = req.body.password
    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if(first && last && username && email && password) {
        if(first.length < 1) {
            res.status(400).send({
                message: "Invalid first name information"
            })
        } else if(email.length <= 2 || email.contains(" ") || !email.contains("@")) {
            res.status(400).send({
                message: "Invalid email registration information"
            })
        } else if(password.length <= 7 || 
                  password.match("[@#$%&*!?]").length > 0 || 
                  !password.includes(" ") ||
                  password.match("[1234567890]").length > 0 ||
                  !password.equals(password.toLowerCase()) ||
                  !password.equals(password.toUpperCase())) {
            res.status(400).send({
                message: "Invalid password registration information"
            })
        } else {
            //We're storing salted hashes to make our application more secure
            //If you're interested as to what that is, and why we should use it
            //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
            let emailSalt = crypto.randomBytes(32).toString("hex")
            let emailToken = getHash(email, emailSalt)
            let salt = crypto.randomBytes(32).toString("hex")
            let salted_hash = getHash(password, salt)

            //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
            //If you want to read more: https://stackoverflow.com/a/8265319
            let theQuery = "INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt, Emailtoken) VALUES ($1, $2, $3, $4, $5, $6, $7)"
            let values = [first, last, username, email, salted_hash, salt, emailToken]
            pool.query(theQuery, values)
                .then(result => {
                    //We successfully added the user, let the user know
                    res.status(201).send({
                        success: true,
                        email: result.rows[0].email
                    })
                    sendEmail("shootthebreeze.verify@gmail.com", email, "Please confirm your email.", emailToken)
                })
                .catch((err) => {
                    //log the error
                    console.log(err)
                    if (err.constraint == "members_username_key") {
                        res.status(400).send({
                            message: "Username exists"
                        })
                    } else if (err.constraint == "members_email_key") {
                        res.status(400).send({
                            message: "Email exists"
                        })
                    } else {
                        res.status(400).send({
                            message: err.detail
                        })
                    }
                })
        }
    } else {
        res.status(400).send({
            message: "Missing required information"
        })
    }
})

module.exports = router
