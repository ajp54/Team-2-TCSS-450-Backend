//express is the framework we're going to use to handle requests
const express = require('express')

//We use this create the SHA256 hash
const crypto = require("crypto")

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

let sendPassword = require('../utilities/utils').sendPassword

var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

let jwt = require('jsonwebtoken')
let config = {
    secret: process.env.JSON_WEB_TOKEN
}

/**
 * @api {post} /forgot Request to resgister a user
 * @apiName GetForgot
 * @apiGroup Forgot
 * 
 * @apiParam {String} email a users email *required unique
 * 
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {String} email the email of the user inserted 
 * 
 * @apiError (400: Invalid email) {String} message "Invalid email information"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: Email exists) {String} message "Email exists"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */ 
router.get('/', (req, res) => {
    res.type("application/json")

    //Retrieve data from query params
    var email = req.query.email
    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if(email) {
        if(email.length <= 2 || email.includes(" ") || !email.includes("@")) {
            res.status(400).send({
                message: "Invalid email information"
            })
        } else {
            let theQuery = "SELECT memberid FROM MEMBERS WHERE email=$1"
            let values = [email]
            pool.query(theQuery, values)
                .then(result => {
                    //We successfully added the user, let the user know
                    res.status(201).send({
                        success: true,
                        //email: result.rows[0].email
                    })
                    let emailToken = jwt.sign({
                        "email": email,
                        memberid: result.rows[0].memberid
                    },

                        config.secret,
                        { 
                            expiresIn: "14 days" // expires in 14 days
                        }
                    )
                    sendPassword("shootthebreeze.verify@gmail.com", email, "Attempt to recover lost password.", emailToken)
                })
                .catch((err) => {
                    //log the error
                    //console.log(err)
                    if (err.constraint == "members_email_key") {
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
