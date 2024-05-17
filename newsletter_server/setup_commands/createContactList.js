const { SESv2Client, CreateContactListCommand } = require('@aws-sdk/client-sesv2');

const client = new SESv2Client();

// Give the list a name
const input = {
    ContactListName: "newsletter_recipients",
};

const command = new CreateContactListCommand(input);

async function createCommand(command) {
    // Create the list
    const response = await client.send(command);
    console.log(response);
}
createCommand(command);