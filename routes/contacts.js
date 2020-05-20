//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()


//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json())


/**
 * @api {get} /contacts/ request to read contacts usernames
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} memberId the member to look up. 
 * 
 * @apiSuccess {Object[]} username List of usernames the user has in contacts
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response) => {
    if(request.decoded != null) {
        try {
          let user = request.decoded
          let theQuery = `SELECT username 
                          FROM members
                          INNER JOIN contacts ON members.memberid=contacts.memberid_B
                          WHERE memberid_A=$1`
          let values = [user.memberid]
          pool.query(theQuery, values)
                  .then(result => {
                      //We successfully update the user, let the user know
                      response.send({
                        //message: "here"
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
 * @api {post} /contacts request to add contact
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
});

/**
 * @api {delete} /contacts request to delete contact
 * @apiName DeleteContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} username the username of the contact to delete
 * 
 * @apiSuccess {String} successfully deleted from contracts
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.delete("/", (request, response) => {
    if(request.body.username != null && request.decoded != null) {
        try {
          let user = request.decoded
          let theQuery = `DELETE FROM Contacts
                          WHERE memberID_A=$1
                          AND memberID_B=
                          (SELECT memberid
                           FROM members 
                           WHERE username=$2)`
          let values = [user.memberid, request.body.username]
          pool.query(theQuery, values)
                  .then(result => {
                      //We successfully update the user, let the user know
                      response.send({
                          message: "Successfully deleted from contacts."
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
});

module.exports = router