const url = require('url')
const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const needle = require('needle')



const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE
const API_WEATHER_URL = process.env.API_WEATHER_URL
const API_GEOLOCATION_URL = process.env.API_GEOLOCATION_URL

let cache = apicache.middleware

router.get('/', cache('2 minutes'), async (req, res, next) => {
    try {
    //   const params = new URLSearchParams({
    //     [API_KEY_NAME]: API_KEY_VALUE,
    //     ...url.parse(req.url, true).query,
    //   })
    const params = req.query.q
    console.log(params);
    
  
      const apiRes = await needle('get', `${API_GEOLOCATION_URL}?q=${params}&limit=1&${API_KEY_NAME}=${API_KEY_VALUE}`)
      const lat = apiRes.body[0].lat
      const lon = apiRes.body[0].lon

      const weatherApiRes = await needle('get', `${API_WEATHER_URL}?lat=${lat}&lon=${lon}&${API_KEY_NAME}=${API_KEY_VALUE}`)

      const data = weatherApiRes.body
  
      // Log the request to the public API
       
  
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  })
  
  module.exports = router