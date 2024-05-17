const { SESv2Client, ListContactListsCommand } = require("@aws-sdk/client-sesv2");

const client = new SESv2Client();

// Page size can be 1 here since there is only one contact list
const input = {
  PageSize: Number(1),
};
const command = new ListContactListsCommand(input);

async function listContactList(command) {
    // Log out the contact lists
    const response = await client.send(command);
    console.log(response);
}

listContactList(command);