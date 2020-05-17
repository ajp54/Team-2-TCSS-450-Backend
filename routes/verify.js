//express is the framework we're going to use to handle requests
const express = require('express')

var router = express.Router()

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

let jwt = require('jsonwebtoken')


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
router.post("/", (request, response) => {
    if(request.query.token != null) {
      try {
        const { memberid: {id} } = jwt.verify(request.query.token, config.secret)
        let theQuery = "UPDATE MEMBERS SET verification=1 WHERE memberid=$1;"
        let values = [id]
        pool.query(theQuery, values)
                .then(result => {
                    //We successfully update the user, let the user know
                    response.status(201).send({
                        verification: result.rows[0].verification
                    })
                })
                .catch((err) => {
                    //log the error
                    //console.log(err)
                  response.status(400).send({
                      message: err.detail
                  })
                })
      } catch (e) {
        response.send(e)
      }
      
    }
    response.send({
      message: "Email has been Validated, and you can now login." 
    })
  
  })

  module.exports = router