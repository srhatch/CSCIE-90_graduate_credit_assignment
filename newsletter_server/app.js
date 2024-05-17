const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

// Create an instance of express, used to process incoming and outgoing HTTP requests
const app = express();

// Parse urlencoded request bodies and create a JS object in req.body 
app.use(bodyParser.urlencoded({extended: false}));

// Send all requests to the router file
app.use('/', router);

module.exports = app;