const API_KEY = process.env.WEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

/**
 * @api {get} /weather Request to get weather information
 * @apiName WorldWeatherOnline
 * 
 * @apiHeader {String} a request for specified weather info
 * 
 */
router.get("/weather", (request, response) => {

    // hardcoded for UWT
    let url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=dc96b2428dc140f09a710254201405&q=98402&format=json&num_of_days=5`

    request(url, function(error, body) {
        if (error) {
            response.send(error)
        } else {
            var n = body.indexOf("{")
            var nakedBody = body.substring(n-1)

            response.send(nakedBody)
        }
    })
})

module.exports = router