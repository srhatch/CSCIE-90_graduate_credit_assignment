const { SESv2Client, DeleteEmailTemplateCommand } = require('@aws-sdk/client-sesv2');

// Instantiage SESClient
const client = new SESv2Client();

// Specify the template name to be deleted
const input = {
    TemplateName: `${process.argv[2]}`
};

// Instantiate the delete template command with the given input
const command = new DeleteEmailTemplateCommand(input);

async function deleteTemplate(command) {
    // Delete the template
    try {
        const response = await client.send(command);
        console.log(response);
    } catch(error) {
        console.error(error);
    }
}
deleteTemplate(command);
