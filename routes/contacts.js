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
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: Missing Pending) {String} message "Missing required pending value"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response, next) => {
    if(request.decoded == null) {
      response.status(400).send({
        message: "Missing required information"
     })
    } else if(request.query.pending == null) {
      response.status(400).send({
        message: "Missing required pending value"
     })
    } else {
      next()
    }
}, (request, response) => {
    let user = request.decoded
    let pending = request.query.pending
    if(pending == "true") {
      let theQuery = `SELECT username
                    FROM members
                    INNER JOIN contacts ON (members.memberid=contacts.memberid_B
                    OR members.memberid=contacts.memberid_A)
                    WHERE verified=0
                    AND memberid!=$1
                    AND memberid_B=$1`
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
                  message: "400 error: SQL error on getting contacts",
                  error: err
              })
            })
    } else {
      let theQuery = `SELECT username, firstName, lastName
                    FROM members
                    INNER JOIN contacts ON (members.memberid=contacts.memberid_B
                    OR members.memberid=contacts.memberid_A)
                    WHERE verified=1
                    AND memberid!=$1
                    AND (memberid_A=$1
                    OR memberid_B=$1)`
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
                  message: "400 error: SQL error on getting contacts",
                  error: err
              })
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
 * @apiParam {String} username the username to add to users contacts
 * 
 * @apiSuccess {String} successfully added to contacts 
 * 
 * @apiError (400: Missing Username) {String} message "Missing required username to add to contacts"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (404: Contact not found) {String} message "Contact not found"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response, next) => {
  //validate that there are no empty parameters
    if(request.body.username == null) {
      response.status(400).send({
        message: "Missing required username to add to contacts"
      })
    } else if(request.decoded == null) {
      response.status(400).send({
        message: "Missing required information"
      })
    } else {
      next()
    }
}, (request, response, next) => {
//validate that username exists in MEMBERS
    let query = 'SELECT * FROM MEMBERS WHERE username=$1'
    let values = [request.body.username]

    pool.query(query, values)
        .then(result => {
          if(result.rowCount == 0) {
            response.status(404).send({
              message: "Contact not found"
            })
          } else {
            next()
          }
        }).catch(error => {
          response.status(400).send({
            message: "SQL Error on contact check",
            error: error
          })
        })
}, (request, response, next) => {
//validate that users are not already contacts
  let user = request.decoded
  let query = `SELECT * FROM CONTACTS 
                WHERE (memberID_A=(SELECT memberid
                                  FROM members
                                  WHERE email=$1)
                AND memberID_B=(SELECT memberid
                                FROM members
                                WHERE username=$2))
                OR (memberID_B=(SELECT memberid
                                FROM members
                                WHERE email=$1)
                AND memberID_A=(SELECT memberid
                                FROM members
                                WHERE username=$2))`
  let values = [user.email, request.body.username]

  pool.query(query, values)
      .then(result => {
        if(result.rowCount > 0) {
          response.status(400).send({
            message: "Username is already a contact"
          })
        } else {
          next()
        }
      }).catch(error => {
        response.status(400).send({
          message: "SQL Error on already in contacts",
          error: error
        })
      })
},(request, response, next) => {
    //insert username into users contacts
      let user = request.decoded
      let theQuery = `INSERT INTO Contacts(memberID_A, memberID_B, verified)
                      VALUES((SELECT memberid 
                              FROM members 
                              WHERE email=$1),
                            (SELECT memberid
                              FROM members
                              WHERE username=$2),
                            $3)`
      let values = [user.email, request.body.username, 0]
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
                    message: "SQL Error on insert",
                    error: err
                })
              })
}, (request, response) => {
              let theQuery = `SELECT username, firstname, lastname
                              FROM members
                              WHERE username=$1`
              let values = [request.body.username]
              pool.query(theQuery, values)
                      .then(result => {
                          //We successfully add the user
                          response.send({
                              rows: result.rows
                          })
                      })
                      .catch((err) => {
                          //log the error
                          //console.log(err)
                        response.status(400).send({
                            message: "SQL Error on delete",
                            error: err
                        })
                      })
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
 * @apiError (400: Missing username) {String} message "Missing required contact username"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (404: Contact not found) {String} message "Contact not found"
 * 
 * @apiError (404: Username not a contact) {String} message "Username not a contact"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.delete("/", (request, response, next) => {
  //validate that there are no empty parameters
  if(request.query.username == null) {
    response.status(400).send({
      message: "Missing required username to remove from contacts"
    })
  } else if(request.decoded == null) {
    response.status(400).send({
      message: "Missing required information"
    })
  } else {
    next()
  }
}, (request, response, next) => {
  //validate that username exists in MEMBERS
  let query = 'SELECT * FROM MEMBERS WHERE username=$1'
  let values = [request.query.username]

  pool.query(query, values)
      .then(result => {
        if(result.rowCount == 0) {
          response.status(404).send({
            message: "Contact not found"
          })
        } else {
          next()
        }
      }).catch(error => {
        response.status(400).send({
          message: "SQL Error on contact check",
          error: error
        })
      })
}, (request, response, next) => {
//validate that users are already contacts
  let user = request.decoded
  let query = `SELECT * FROM CONTACTS 
                WHERE memberID_A=(SELECT memberid
                                  FROM members
                                  WHERE email=$1)
                AND memberID_B=(SELECT memberid
                                FROM members
                                WHERE username=$2)
                OR (memberID_B=(SELECT memberid
                                FROM members
                                WHERE email=$1)
                AND memberID_A=(SELECT memberid
                                FROM members
                                WHERE username=$2))`
  let values = [user.email, request.query.username]

  pool.query(query, values)
      .then(result => {
        if(result.rowCount == 0) {
          response.status(404).send({
            message: "Username is not a contact of user"
          })
        } else {
          next()
        }
      }).catch(error => {
        response.status(400).send({
          message: "SQL Error on already in contacts",
          error: error
        })
      })
}, (request, response, next) => {
  let user = request.decoded
  let theQuery = `DELETE FROM Contacts
                  WHERE memberID_A=$1
                  AND memberID_B=
                  (SELECT memberid
                    FROM members 
                    WHERE username=$2)
                  OR memberID_B=$1
                  AND memberID_A=
                  (SELECT memberid
                    FROM members
                    WHERE username=$2)`
  let values = [user.memberid, request.query.username]
  pool.query(theQuery, values)
          .then(result => {
            if(result.rowCount == 0) {
              response.status(404).send({
                message: "deleted user as a contact"
              })
            } else {
              next()
            }
          })
          .catch((err) => {
              //log the error
              //console.log(err)
            response.status(400).send({
                message: "SQL Error on delete",
                error: err
            })
          })
}, (request, response) => {
              let theQuery = `SELECT username
                              FROM members
                              WHERE username=$1`
              let values = [request.query.username]
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
                            message: "SQL Error on delete",
                            error: err
                        })
                      })
});

/**
 * @api {put} /contacts request to update contact with user
 * @apiName PutContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} username the username to add to users contacts
 * 
 * @apiSuccess {String} successfully updated contact
 * 
 * @apiError (400: Missing Username) {String} message "Missing required username to update contacts"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (404: Contact not found) {String} message "Contact not found"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.put("/", (request, response, next) => {
  //validate that there are no empty parameters
    if(request.body.username == null) {
      response.status(400).send({
        message: "Missing required username of contact to update"
      })
    } else if(request.decoded == null) {
      response.status(400).send({
        message: "Missing required information"
      })
    } else {
      next()
    }
}, (request, response, next) => {
//validate that username exists in MEMBERS
    let query = 'SELECT * FROM MEMBERS WHERE username=$1'
    let values = [request.body.username]

    pool.query(query, values)
        .then(result => {
          if(result.rowCount == 0) {
            response.status(404).send({
              message: "Contact not found"
            })
          } else {
            next()
          }
        }).catch(error => {
          response.status(400).send({
            message: "SQL Error on contact check",
            error: error
          })
        })
}, (request, response, next) => {
//validate that users are already contacts
  let user = request.decoded
  let query = `SELECT * FROM CONTACTS 
                WHERE memberID_A=(SELECT memberid
                                  FROM members
                                  WHERE email=$1)
                AND memberID_B=(SELECT memberid
                                FROM members
                                WHERE username=$2)
                OR (memberID_B=(SELECT memberid
                                FROM members
                                WHERE email=$1)
                AND memberID_A=(SELECT memberid
                                FROM members
                                WHERE username=$2))`
  let values = [user.email, request.body.username]

  pool.query(query, values)
      .then(result => {
        if(result.rowCount == 0) {
          response.status(400).send({
            message: "Username is not a contact"
          })
        } else {
          next()
        }
      }).catch(error => {
        response.status(400).send({
          message: "SQL Error on check if user is contact",
          error: error
        })
      })
},(request, response, next) => {
    //update users verified contact status
      let user = request.decoded
      let theQuery = `UPDATE CONTACTS
                      SET verified=1
                      WHERE memberID_A=$1
                      AND memberID_B=
                      (SELECT memberid
                       FROM members 
                       WHERE username=$2)
                      OR memberID_B=$1
                      AND memberID_A=
                      (SELECT memberid
                       FROM members
                       WHERE username=$2)`
      let values = [user.memberid, request.body.username]
      pool.query(theQuery, values)
              .then(result => {
                  //We successfully update the user, let the user know
                  if(result.rowCount == 0) {
                    response.status(404).send({
                      message: "deleted user as a contact"
                    })
                  } else {
                    next()
                  }
              })
              .catch((err) => {
                  //log the error
                  //console.log(err)
                response.status(400).send({
                    message: "SQL Error on update",
                    error: err
                })
              })
}, (request, response) => {
              let theQuery = `SELECT username
                              FROM members
                              WHERE username=$1`
              let values = [request.body.username]
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
                            message: "SQL Error on delete",
                            error: err
                        })
                      })
  });

module.exports = router