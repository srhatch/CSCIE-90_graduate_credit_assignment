const { SESv2Client, CreateEmailTemplateCommand } = require( '@aws-sdk/client-sesv2');

// Instantiate SESClient
const client = new SESv2Client();

// Set the email body. Loops over a list of articles
const emailBody = `
    <h1>Explore this week's topics: </h1>
    <div>{{#each articles}}<div>{{this}}</div>{{/each}}</div>
    <br>
    <a href={{amazonSESUnsubscribeUrl}}>Unsubscribe</a>
`

// Argument to create template command
const input = {
    TemplateName: 'newsletter_template',
    TemplateContent: {
        Subject: 'This week\'s articles',
        Html: emailBody
    }
}
// Instantiate create templace command
const command = new CreateEmailTemplateCommand(input);

// Create the template
async function sendCommand(command) {
    try {
        const response = await client.send(command);
        console.log(response);
    } catch(error) {
        console.error(error);
    }
}
sendCommand(command);
