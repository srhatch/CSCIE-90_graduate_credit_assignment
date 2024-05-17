const { SESv2Client, ListContactsCommand } = require("@aws-sdk/client-sesv2");

const client = new SESv2Client();

// Specify the contact list
// There is only 1 contact in this demo so page size can be set to 1
const input = {
  ContactListName: "newsletter_recipients",
  PageSize: Number(1)
};

const command = new ListContactsCommand(input);

async function createCommand(command) {
    // Get contacts from the list and log the results
    const response = await client.send(command);
    console.log(response);
}
createCommand(command);