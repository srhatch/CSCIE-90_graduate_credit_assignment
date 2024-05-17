const {SESv2Client, SendEmailCommand} = require('@aws-sdk/client-sesv2');

// A wrapper function for exporting
async function sendEmail(userData, toAddress) {
    // Instantiate the SESClient
    const client = new SESv2Client();

    // Serialize the userData object to a JSON string
    const userDataJson = JSON.stringify(userData);

    // Set the input argument to send templated email command
    // Source, in this case, will always be this address
    // Specify the template with its name
    // TemplateData will be interpolated into the template
    const input = {
        FromEmailAddress: 'cscie90sender@gmail.com',
        Destination: {
            ToAddresses: [toAddress]
        },
        Content: {
            Template: {
                TemplateName: 'email_verification_template',
                TemplateData: userDataJson
            }
        }
    }
    
    // Instantiate the send templated email command
    const command = new SendEmailCommand(input);
    
    // Send the email
    const response = await client.send(command);
    console.log(response);
}

module.exports = sendEmail;
