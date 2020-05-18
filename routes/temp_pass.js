// //express is the framework we're going to use to handle requests
// const express = require('express')

// var router = express.Router()

// //Access the connection to Heroku Database
// let pool = require('../utilities/utils').pool

// let getHash = require('../utilities/utils').getHash

// const bodyParser = require("body-parser")
// //This allows parsing of the body of POST requests, that are encoded in JSON
// router.use(bodyParser.json())

// let jwt = require('jsonwebtoken')
// let config = {
//     secret: process.env.JSON_WEB_TOKEN
// }

// /**
//  * @api {get} /Temp_pass Request to verify the user
//  * @apiName GetTemp_pass
//  * @apiGroup Temp_pass
//  * 
//  * @apiParam {String} a token to identify the user
//  * 
//  * @apiSuccess (Success 201) {boolean} success true when the user password is set to a temporary value
//  * 
//  */ 
// router.get("/", (request, response) => {
//     if(request.query.token != null) {
//       try {

//         let password = crypto.randomBytes(10).toString("hex")
//         password = password.concat("$Sb9")

//         let salt = crypto.randomBytes(32).toString("hex")
//         let salted_hash = getHash(password, salt)

//         let user = jwt.verify(request.query.token, config.secret)
//         let theQuery = "UPDATE MEMBERS SET salted_hash=$1, salt=$2 WHERE email=$3"
//         let values = [salted_hash, salt, user.email]
//         pool.query(theQuery, values)
//                 .then(result => {
//                     //We successfully update the user, let the user know
//                     response.status(201).send({
//                         success: true
//                     })
//                 })
//                 .catch((err) => {
//                     //log the error
//                     //console.log(err)
//                   response.status(400).send({
//                       message: err.detail
//                   })
//                 })
//       } catch (e) {
//         response.send(e)
//       }
      
//     }
//     response.send({
//       message: `Please use the temporary password ${password} to login and then change your password.`
//     })
  
//   })

//   module.exports = router