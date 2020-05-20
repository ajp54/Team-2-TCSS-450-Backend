//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()


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
router.get("/", (request, response) => {
    if(request.decoded != null) {
        response.send(request.decoded)
        try {
          let user = request.decoded
          let theQuery = `SELECT memberid_B FROM contacts
                          INNER JOIN members ON contacts.memberid_A=member.memberid
                          WHERE memberid=$1`
          let values = [user.memberid]
          pool.query(theQuery, values)
                  .then(result => {
                      //We successfully update the user, let the user know
                      response.send({
                        rows: result.rows
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
        
      } else {
        response.status(400).send({
            message: "Missing required information"
        })
      }
      
});

/**
 * @api {post} /contacts/post/
 * @apiName PostContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} otherEmail the email to add to users contacts
 * 
 * @apiSuccess {String} successfully added to contacts 
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response) => {
    if(request.body.otherEmail != null && request.decoded != null) {
        try {
          let user = request.decoded
          let theQuery = `INSERT INTO Contacts(memberID_A, memberID_B, verified)
                          VALUES(SELECT members.memberid 
                                 FROM members 
                                 WHERE members.email=$1),
                                (SELECT members.memberid
                                 FROM members
                                 WHERE members.email=$2),
                                $3)`
          let values = [user.email, request.body.otherEmail, 0]
          pool.query(theQuery, values)
                  .then(result => {
                      //We successfully update the user, let the user know
                      response.send({
                          message: "Successfully added to contacts."
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
      else {
        response.status(400).send({
            message: "Missing required information"
        })
      }
      response.send({
        message: "Contacts have been retrieved." 
      })
});

/**
 * @api {delete} /contacts/delete/
 * @apiName DeleteContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} otherEmail the email to add to users contacts
 * 
 * @apiSuccess {String} successfully added to contacts 
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.delete("/", (request, response) => {
    if(request.body.otherEmail != null && request.decoded != null) {
        try {
          let user = request.decoded
          let theQuery = `DELETE FROM Contacts
                          WHERE memberID_A=$1
                          AND memberID_B=`
          let values = [user.memberid, request.body.othermemberID]
          pool.query(theQuery, values)
                  .then(result => {
                      //We successfully update the user, let the user know
                      response.send({
                          message: "Successfully added to contacts."
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
      else {
        response.status(400).send({
            message: "Missing required information"
        })
      }
      response.send({
        message: "Contacts have been retrieved." 
      })
});

module.exports = router