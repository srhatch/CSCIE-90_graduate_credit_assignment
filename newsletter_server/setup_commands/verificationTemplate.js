const { SESv2Client, CreateEmailTemplateCommand } = require( '@aws-sdk/client-sesv2');

// Create an SESClient instance
const client = new SESv2Client();

// The HTML of the email body needs to be in string format
const emailBody = `
    <div>Thank you for signing up for the newsletter {{firstName}} {{lastName}}</div>
    <div>Click the link below to verify your email address so you can start receiving regular emails</div>
    <a href='http://127.0.0.1:8000/verify/{{email}}'>Verify email</a>
`
// The argument to the create template command. The name here is used in the send email command
// (and other API actions) to identify the template
const input = {
    TemplateName: 'email_verification_template',
    TemplateContent: {
        Subject: 'Verification required',
        Html: emailBody
    }
}
// Instantiate the create template command
const command = new CreateEmailTemplateCommand(input);

async function sendCommand(command) {
    // Create the template
    try {
        const response = await client.send(command);
        console.log(response);
    } catch(error) {
        console.error(error);
    }
}
sendCommand(command);
