const API_KEY = process.env.WEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

/**
 * @api {get} /weather Request to get weather information
 * @apiName GetWeather
 * 
 * @apiHeader {String} a request for specified weather info
 * 
 * @apiParam {String} url the url to poll the weather API
 * 
 * @apiSuccess (Success 201) {boolean} success true when the weather information is returned
 * 
 */
router.get("/", (request, response) => {

    // hardcoded for UWT
    if(request.params.zipcode) {
        let zipcode = request.params.zipcode

        let url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API_KEY}&q=${zipcode}&format=json&num_of_days=7&fx24=yes`

        response.redirect(url)
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
    
    // request(url, function(error, response) {
    //     console.log("MADE IT TO REQUEST")
    //     if (error) {
    //         response.send(error)
    //     } else {
    //         response.send(response)
    //     }
    // })

    //      let url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${API_KEY}&q=${zipcode}&format=json&num_of_days=7&fx24=yes`

    //     response.redirect(url)
})

module.exports = router