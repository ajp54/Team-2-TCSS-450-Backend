//express is the framework we're going to use to handle requests
const express = require('express')

var router = express.Router()

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

let jwt = require('jsonwebtoken')
let config = {
  secret: process.env.JSON_WEB_TOKEN
}

/**
 * @api {get} /verify Request to verify the user
 * @apiName GetVerify
 * @apiGroup Verify
 * 
 * @apiParam {String} a token to identify the user
 * 
 * @apiSuccess (Success 201) {boolean} success true when the user verification is updated
 * @apiSuccess (Success 201) {String} verification the verification number of the user
 * 
 * @apiError (400) {String} Send the error details in response
 */ 
router.get("/", (request, response) => {
    if(request.query.token == null) {
      res.status(400).send({
        message: "Missing required token code for verification"
      })
    } else {
      let user = jwt.verify(request.query.token, config.secret)
      let theQuery = "UPDATE MEMBERS SET verification=1 WHERE email=$1"
      let values = [user.email]
      var http = require('http')
      , fs = require('fs');
      
      pool.query(theQuery, values)
              .then(result => {
                  //We successfully update the user, let the user know
                  fs.readFile(__dirname + '/ShootTheBreezeLogo.png', function(err, data) {
                    if (err) throw err; // Fail if the file can't be read.
                    http.createServer(function(req, res) {
                      res.writeHead(200, {'Content-Type': 'image/png'});
                      res.end(data); // Send the file data to the browser.
                    }).listen(8124);
                  });
              })
              .catch((err) => {
                  //log the error
                  //console.log(err)
                response.status(400).send({
                    message: err.detail
                })
              })
    }
  })

  module.exports = router