const { SESv2Client, CreateContactCommand } = require('@aws-sdk/client-sesv2');
const express = require('express');
const path = require('path');
const sendEmail = require('./ses_commands/sendVerificationEmail');

const client = new SESv2Client();

// Instantiate an express router
const router = express.Router();

// Define the path to the root folder that will contain the HTML pages to be sent to the browser
const publicRoot = path.join(__dirname + '/public');

router.get('/', (req, res, next) => {
    // Send the home page (with the registration form) to the browser
    res.sendFile('register.html', {root: publicRoot});
})

router.post('/register', async (req, res, next) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    // Send a verification email to the specified address
    sendEmail(userData, req.body.email);
    res.status(200);
    res.send('Thank you for registering! Check your email to validate your account');
})

router.get('/verify/:email', async (req, res, next) => {
    const input = {
        ContactListName: 'newsletter_recipients',
        EmailAddress: req.params.email
    };
    const command = new CreateContactCommand(input);
    const response = await client.send(command);
    console.log(response);
    res.sendFile('verified.html', {root: publicRoot});
})

module.exports = router;