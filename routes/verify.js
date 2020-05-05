//express is the framework we're going to use to handle requests
const express = require('express')

var router = express.Router()

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())


/**
 * @api {post} /verify Request to verify the user
 * @apiName GetVerify
 * @apiGroup Verify
 * 
 * @apiParam {String} a token to identify the user
 * 
 * @apiSuccess (Success 201) {boolean} success true when the user verification is updated
 * @apiSuccess (Success 201) {String} verification the verification number of the user
 * 
 */ 
router.get("/", (request, response) => {
    if(request.query.token != null) {
      var token = request.query.token.toString()
      let theQuery = "UPDATE MEMBERS SET verification=1 WHERE emailtoken=$1;"
      let values = [token]
      pool.query(theQuery, values)
              .then(result => {
                  //We successfully update the user, let the user know
                  response.status(201).send({
                      
                      //verification: result.rows[0].verification
                  })
              })
              .catch((err) => {
                  //log the error
                  console.log(err)
                response.status(400).send({
                    message: err.detail
                })
              })
    }
    
    
    // response.send({
    //   message: "Email has been Validated, and you can now login."
    // })
  
  })

  module.exports = router