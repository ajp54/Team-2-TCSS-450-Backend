//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

const request = require('request')

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json())


/**
 * @api {get} /contacts/get/
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} memberId the member to look up. 
 * 
 * @apiSuccess {Number} rowCount the number of chat IDs returned
 * @apiSuccess {Object[]} chatIds List of chat IDs the member is in
 * @apiSuccess {String} messages.email The email for the member in the chat
 * 
 * @apiError (404: ChatId Not Found) {String} message "Member ID Not Found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. memberId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response, next) => {
    if(request.decoded != null) {
        try {
          let user = request.decoded
          let theQuery = `SELECT Contacts.MemberID_B
                          FROM Contacts
                          WHERE MemberID_A=$1`
          let values = [user.memberid]
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
        message: "Contacts have been retrieved." 
      })
});
