//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()


//This allows parsing of the body of POST requests, that are encoded in JSON
// router.use(require("body-parser").json())

/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */ 

/**
 * @api {get} /chats/:chatId? Request to get the chat rooms a user is part of
 * @apiName GetMembers
 * @apiGroup Chats
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
    //validate chat id exists
    let query = 'SELECT * FROM Members WHERE MemberId=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Member ID '" + request.decoded.memberid + "' not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
    }, (request, response) => {
        //Retrive the chatIds
        let query = `SELECT ChatId
                    FROM ChatMembers
                    WHERE MemberId=$1`
        let values = [request.decoded.memberid]
        pool.query(query, values)
            .then(result => {
                response.send({
                    // rowCount : result.rowCount,
                    rows: result.rows
                    //memberid: request.decoded.memberid
                })
            }).catch(err => {
                response.status(400).send({
                    message: "SQL Error",
                    error: err
                })
            })
});

module.exports = router