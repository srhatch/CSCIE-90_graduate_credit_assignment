const {SESv2Client, SendEmailCommand, ListContactsCommand} = require('@aws-sdk/client-sesv2');

async function getContacts(client){
      // Get all contacts in the specified contact list
    const input = {
        ContactListName: "newsletter_recipients",
        PageSize: Number(1)
      };
      const command = new ListContactsCommand(input);
      const response = await client.send(command);
      return response;
}

async function sendEmail() {  
    // Define an array of articles as a property of an object
    const templateObj = {
        articles: [
            'https://en.wikipedia.org/wiki/Newsletter',
            'https://en.wikipedia.org/wiki/Node.js',
            'https://en.wikipedia.org/wiki/JavaScript'
        ]
    };
    // Serialize the object
    const templateObjJson = JSON.stringify(templateObj);

    // Instantiate SESClient
    const client = new SESv2Client();

    // Get the newsletter_recipient contact list
    const contactList = await getContacts(client);

    // The ToAddresses property in the input object takes an array as its value
    // put all contact email addresses into an array
    const emailList = [];
    contactList.Contacts.forEach(contact => emailList.push(contact.EmailAddress));

    // Define the input argument to send template email command
    const input = {
        FromEmailAddress: 'cscie90sender@gmail.com',
        Destination: {
            ToAddresses: emailList
        },
        Content: {
            Template: {
                TemplateName: 'newsletter_template',
                TemplateData: templateObjJson                
            }
        },
        ListManagementOptions: {
            ContactListName: 'newsletter_recipients'
        }
    }

    // Instantiate send templated email command
    const command = new SendEmailCommand(input);
    
    // Send the email
    const response = await client.send(command);
    console.log(response);
}

module.exports = sendEmail;