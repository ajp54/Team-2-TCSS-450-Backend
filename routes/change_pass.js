// //express is the framework we're going to use to handle requests
// const express = require('express')

// //We use this create the SHA256 hash
// const crypto = require("crypto")

// //Access the connection to Heroku Database
// let pool = require('../utilities/utils').pool

// let getHash = require('../utilities/utils').getHash 

// var router = express.Router()

// const bodyParser = require("body-parser")
// //This allows parsing of the body of POST requests, that are encoded in JSON
// router.use(bodyParser.json())

// /**
//  * @api {post} /change_pass
//  * @apiName PostChange_Pass
//  * @apiGroup change_pass
//  * 
//  * @apiParam {String} email a users email *required unique
//  * @apiParam {String} password a users password
//  * @apiParam {String} newpassword a users new password
//  * 
//  * @apiSuccess (Success 201) {boolean} success true when the password is updated
//  * @apiSuccess (Success 201) {String} email the email of the user updated
//  * 
//  * @apiError (400: Invalid email) {String} message "Invalid email information"
//  * 
//  * @apiError (400: Invalid password) {String} message "Invalid password information"
//  * 
//  * @apiError (400: Invalid newpassword) {String} message "Invalid new password information"
//  * 
//  * @apiError (400: Missing Parameters) {String} message "Missing required information"
//  * 
//  * @apiError (400: Email exists) {String} message "Email exists"
//  * 
//  * @apiError (400: SQL Error) {String} message the reported SQL error details
//  */ 
// router.post('/', (req, res) => {
//     res.type("application/json")

//     //Retrieve data from query params
//     var email = req.body.email
//     var password = req.body.password
//     var newpassword = req.body.newpassword
//     //Verify that the caller supplied all the parameters
//     //In js, empty strings or null values evaluate to false
//     if(email && password && newpassword) {
//         if(email.length <= 2 || email.includes(" ") || !email.includes("@")) {
//             res.status(400).send({
//                 message: "Invalid email registration information"
//             })
//         } else if(password.length <= 7 || 
//                   password.match("[@#$%&*!?]") == null || 
//                   password.includes(" ") ||
//                   password.match("[0-9]") == null ||
//                   password.match("[a-z]") == null ||
//                   password.match("[A-Z]") == null) {
//             res.status(400).send({
//                 message: "Invalid password registration information"
//             })
//         } else if(newpassword.length <= 7 ||
//                   newpassword.match("[@#$%&*!?]") == null || 
//                   newpassword.includes(" ") ||
//                   newpassword.match("[0-9]") == null ||
//                   newpassword.match("[a-z]") == null ||
//                   newpassword.match("[A-Z]") == null) {
//             res.status(400).send({
//                 message: "Invalid new password registration information"
//             })
//         } else {
//             //We're storing salted hashes to make our application more secure
//             let salt = crypto.randomBytes(32).toString("hex")
//             let salted_hash = getHash(password, salt)

//             let theQuery = "UPDATE MEMBERS SET salted_hash=$1, salt=$2 WHERE email=$3"
//             let values = [salted_hash, salt, email]
//             pool.query(theQuery, values)
//                 .then(result => {
//                     //We successfully update the user password, let the user know
//                     res.status(201).send({
//                         success: true,
//                         //email: result.rows[0].email
//                     })
//                 })
//                 .catch((err) => {
//                     //log the error
//                     //console.log(err)
//                     if (err.constraint == "members_email_key") {
//                         res.status(400).send({
//                             message: "Email exists"
//                         })
//                     } else {
//                         res.status(400).send({
//                             message: err.detail
//                         })
//                     }
//                 })
//         }
//     } else {
//         res.status(400).send({
//             message: "Missing required information"
//         })
//     }
// })

// module.exports = router
