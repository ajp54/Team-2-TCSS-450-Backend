//express is the framework we're going to use to handle requests
const express = require('express')

var router = express.Router()

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {get} /weather Request to get weather information
 * @apiName WorldWeatherOnline
 * 
 * @apiHeader {String} a request for specified weather info
 * 
 */
