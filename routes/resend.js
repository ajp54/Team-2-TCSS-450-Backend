//express is the framework we're going to use to handle requests
const express = require('express')

var router = express.Router()

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

let sendEmail = require('../utilities/utils').sendEmail

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

let jwt = require('jsonwebtoken')
let config = {
    secret: process.env.JSON_WEB_TOKEN
}

/**
 * @api {get} /resend request a new verification email
 * @apiName GetResend
 * @apiGroup Resend
 * 
 * @apiParam {String} email a users email *required unique
 * 
 * @apiSuccess (Success 201) {boolean} success true when the memberid is selected
 * @apiSuccess (Success 201) {String} email the email of the user inserted 
 * 
 * @apiError (400) {String} message error details
 * @apiError (400: missing parameter) {String} message missing parameter information
 * 
 */ 
router.get('/', (req, res) => {
    res.type("application/json")

    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if(req.query.email != null) {
        var email = req.query.email
        if(email.length <= 2 || email.includes(" ") || !email.includes("@")) {
            res.status(400).send({
                message: "Invalid email registration information"
            })
        } else {
            let theQuery = "SELECT memberid FROM MEMBERS WHERE email=$1"
            let values = [email]
            pool.query(theQuery, values)
                .then(result => {
                    //We successfully added the user, let the user know
                    res.status(201).send({
                        success: true
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
                    sendEmail("shootthebreeze.verify@gmail.com", email, "Please confirm your email.", emailToken)
                })
                .catch((err) => {
                    //log the error
                    //console.log(err)
                    res.status(400).send({
                        message: err.detail
                    })
                })
            
        }
    } else {
        res.status(400).send({
            message: "Missing required information"
        })
    }
            
            
})

module.exports = router
