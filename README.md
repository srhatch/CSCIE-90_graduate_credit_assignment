[Video presentation](https://youtu.be/NTdOLpsOnWk)

This project is an email verification system built with AWS’s Simple Email Service. Email verification is an important consideration for any entity that uses email for communication with customers. Verifying an email address is good practice for security and for accuracy of communication, both of which help with what AWS calls sender reputation. SES provides the ability to send emails programmatically, allowing this service to be built into server software and to automate email sending. I’m using the idea of a newsletter email to simulate why this process is useful. Any email service that carelessly sends out emails, especially at a regular interval, could risk damaging the sender’s reputation. My server will have code running in the background that will send emails at an interval, but only to users that have been verified.
	Email verification typically involves sending an email with a link to the given address and having the user click the link to verify the address. I’m using an SES contact list to keep track of users who have been verified. Any email addresses listed in the contact list that do not have the “UnsubscribeAll” property set to true will receive newsletter emails. I use a setInterval() function to send out emails at a ten second interval. This short interval is used given the time constraint of the video presentations.
	I used the JavaScript SDK to perform operations with SES and wrote the server with Node. The home page “register.html” will have a registration form where a user can enter their email address, first name, and last name. After clicking submit, the server will send a confirmation response to the browser and a verification email will be sent to the inbox of the address that was entered. This email will contain a verification link and will display the users name as entered in the registration form.  After clicking this link, the user will be added to the  contact list and will be redirected to another confirmation page. The newsletter template will contain unsubscribe links, so as the user starts receiving the regular newsletter emails, they will have to option of unsubscribing. Clicking on the unsubscribe link will redirect to an HTML page provided by Amazon. Opting to unsubscribe will result in the “UnsubscribeAll” property to be set to true in the contact list entry and the user will stop receiving emails.

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/51a5d14a-55bf-4444-8af4-cc4edd735e4c)

 
SES has other features to support email operations. Metric monitoring can be used to protect sender reputation. An email bounce is what happens when an email fails to be sent through SES. A soft bounce typically happens with network issues or if the receiving mailbox is full. SES will try a few times to send an email after a soft bounce and this usually doesn’t result in further action if the email completely fails to send. A hard bounce typically happens when a mailbox doesn’t exist or if the address is on a suppression list (meaning the user has requested to not receive emails). AWS will send a notification to the account owner either by email or through Simple Notification Service depending on how the account is configured. SES also keeps track of complaints that are generated usually when a user reports an email as spam. Bounces and complaints are expressed as rates in SES, and AWS can suspend accounts that have high rates of either. Alarms can be created with CloudWatch to notify an account owner if rates reach certain levels and Lambda functions can be created to automatically pause email sending based on those CloudWatch metrics.

Create SES account
When creating an account with SES, initially the account is put into a sandbox. This means that a limited number of emails can be sent per day (200), and that emails can only be sent to and from verified email addresses. To move an account out of the sandbox, a user will have to make a request to AWS and will have to explain what they are going to be using SES for. AWS will also verify the domain name used for the account. SES is a powerful tool that could easily be abused to send out large amounts of spam, so AWS does a lot to protect both their reputation and account sender reputation. For the needs of this project, I am going to verify two email addresses within the sandbox to work around the requirement of a domain name. One address will represent the sender (cscie90sender@gmail.com), and the other will represent a receiver (cscie90receiving@gmail.com). 

To verify an email address:
SES => verified identities => create identity

Select email address and enter the address you want to verify:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/59ab76c9-91a9-4bab-af65-915e1e902681)


At this point a verification email will be sent to that address:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/da2f618b-33fe-4e3b-84ca-9cf4610c4abf)


Clicking the link in the verification email will redirect to this page:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/744a3f7f-1119-4b65-9b7d-8c0091e1350f)


And the address is now verified:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/855692fe-6394-4dd1-93d0-2c04a4e6ea89)


Test emails can be sent to verified addresses, so after verifying the receiving address, we can test that the address is capable of receiving emails through SES.

In the “Verified identities” menu, select “Send test email”:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/ec77576e-e435-44c3-aae6-bc94741ce99b)


Select “Formatted” to have SES construct the email automatically. Select “Custom” scenario to enter the receiving email address:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/bd1bb51b-5bdf-4383-91c6-bce10ff31270)


Fill out a body and send it:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/0c0142d1-4e1a-459f-9c7c-535a886a3905)


It should now show up in the inbox of the given address. Note the “via amazonses.com” in the from field:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/260ae494-ef14-4e59-b850-0c1d86cee03e)


Trying to send an email to the address I use for school, which is not validated, will result in an error.

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/44bd2583-5470-46d6-863e-44c438255506)


Create programmatic user
A programmatic user needs to be created for the SDK to work properly. Because the JavaScript code is accessing an AWS resource, AWS needs some way of authenticating the code.

In the IAM home page:
Users => Create user => Enter a name (don’t select “Provide user access to the AWS Management Console”) => Add “AmazonSESFullAccess” permissions, either added to a group or attached to the user directly => Select “Create user”

Navigate to the user in IAM:
Create access key => Select “Local code” => Copy credentials into respective files in .aws folder in the home directory of the computer the server is running on

Format for files in .aws folder:

Filename “credentials”
[default]
aws_access_key_id = 
aws_secret_access_key = 

Filename “config”
[default]
region = us-east-1

Now the server can access SES resources with this user:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/7039ca3e-4606-4cb4-b700-0c1ed9608239)


Downloading Node and libraries
On the NodeJS website, Node can be directly downloaded onto the proper OS:
[https://nodejs.org/en/download](https://nodejs.org/en/download)

NPM is the package manager that comes with Node, so we can use that to download the necessary libraries to make this project work.

In a terminal window, navigate to the project directory and run the following commands:

Initialize a Node project:
npm init

Install express, which is used to process incoming and outgoing HTTP requests:
npm install express

Install body-parser, which is used to parse data sent in the HTTP body into a JavaScript object:
npm install body-parser

Install the AWS JavaScript SDK to work with SES:
npm install @aws-sdk/client-sesv2

Create a start script in package.json. This is to make starting the server from the command line a bit easier to type:
“scripts”: {
    “start”: “node ./bin/www”
}

Installing NodeJS on EC2:
For the demo, I’m going to be running the server in my development environment, but in a production environment the server might be running on an EC2 instance. Installing Node on EC2 involves a few steps.

Install NVM (Node version manager):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

Activate NVM:
. ~/.nvm/nvm.sh

Install NodeJS with NVM:
nvm install –lts

Test that Node is installed:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/075632d6-30aa-4c98-83e6-b26862a82527)


Source:
[https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)
[https://github.com/nvm-sh/nvm#install--update-script](https://github.com/nvm-sh/nvm#install--update-script)

The credentials for the programmatic user would need to be added to the EC2 instance in ~/.aws as well for the SDK to work.


Configuring SES programmatically

Create an email template:
SES is an API heavy service. There actually isn’t a way to create templates in the AWS console. To create an email template, a program must be written using the API exposed through the SDK.

Create a folder called setup_commands in the root directory of the project.

setup_commands/verificationTemplate.js:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/4795179c-29c1-4259-be2e-1413df103800)
Import the SESv2Client and CreateEmailTemplateCommand. Instantiate the SESv2Client.


Create the email body:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/24b4eb53-2e3e-4851-9dd9-6b280659eaba)
Backticks can be used in JavaScript to create multiline strings for readability. Note the Handlebars syntax {{ }} that is used as a placeholder for where data will be interpolated.

Set the input object. The HTML string (email body) is the value of the property “Html”. The “Subject” property is the subject line in the email. “TemplateName” is used to identify the template in other API actions:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/34814836-7228-4a7d-b0ce-07614ab57623)


Pass the input object as an argument to the create template command:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/56a36caa-cddd-4cdb-b204-342ef3b81967)


Pass the template command as an argument to the send() method of the SESClient:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/6eb2b5ac-16d0-42de-bd55-044ee9550aed)


This program will have to be run independently from the server. In a terminal window, navigate to the directory containing the file and run the following:
node verificationTemplate

Now we can see the created template in the AWS console. Navigate to “Email templates” in SES:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/ea997eee-7523-4571-b4c8-4b3c2377fd71)


We will create another template (setup_commands/newsletterTemplate.js) to be used for the newsletter that is sent to verified users:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/60267e0d-e857-4a94-b5bf-959c706dbc69)
Note the {{amazonSESUnsubscribeUrl}}. This is a stand-in for a URL that will take the user off of the contact list and will only work if ListManagementOptions is set in the input object for SendEmailCommand.
Also note the Handlebars syntax used to loop over the list of articles that will be provided when actually sending the email.


Create the template with client.send(command):

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/ef3927f8-a227-434a-9a96-a7a07ad79100)


After running this program, there are now two templates in the AWS console:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/72be1213-969b-4e31-9831-26d902706a02)


In case changes need to be made, we can create a similar program for deleting templates.
setup_commands/deleteTemplate.js

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/b77b003e-973c-4b97-bbfd-19ae3a796501)
process.argv is a Node object that can be used to capture command line arguments. It returns an array, of which the first two elements are reserved leaving the rest of the elements to represent arguments passed in to the command line. By using the command “node deleteTemplate <nameOfTemplate>” the third element (index 2) will be filled with whatever is passed as <nameOfTemplate>.


We can test the delete program on the newsletter template and check that it worked:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/9ca9357e-0646-44b7-9def-a99fed845c14)


Now there’s only one template:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/527a904c-0dfd-4230-85f8-4088401fed23)

Sources:
[https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email-advanced.html](https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email-advanced.html)
[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/CreateTemplateCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/command/CreateTemplateCommand/)


Handlebars syntax
AWS uses HandlebarsJS syntax for email templates. Handlebars templates take in an input object with values set to be interpolated into the template. Double brackets {{value}} are used to designate where a value should appear in the template. 

For example, if the input object looks like this:
{
    “firstName”: “Sam”,
    “lastName”: “Hatch”
}

And the template looked like this:
<div>Hello {{firstName}} {{lastName}}</div>

The following would be rendered:
Hello Sam Hatch

Double brackets can also be used to signal an evaluation context so that basic operations like looping and logic can be used to process larger data structures.



For example, to render some value if it exists in the input object or to render something else if it does not, an if statement could be used (from the Handlebars website):
{{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
{{else}}
    <h1>Unknown author</h1>
{{/if}}


Source:
[https://handlebarsjs.com](https://handlebarsjs.com)


A contact list has to be created in SES to keep track of users who are verified and subscribed to receive emails.

setup_commands/createContactList.js

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/f193b4de-1f89-4bb6-a441-103d5b78ac95)


Run the program from the terminal:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/51b0f11b-8a40-4347-b5b5-5fa65b04ad39)


To check that the list has been created, create a program to log contact lists.
setup_commands/logContactList.js

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/829724fc-8906-492c-aa87-4f6d1e387462)


This can be run with the command:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/04bbee3c-b150-4aef-b2ec-4c138af03450)


It will also be useful to create a program to check that a user has been added to a contact list. This will be used later in the demo.

setup_commands/logContacts.js

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/8ab70711-4ad0-4a67-9823-3ee8d9c20a9f)


This can be run with the command:
node logContacts


Writing the server

This project uses a very basic Node server coupled with the Express library to process HTTP requests.
In the project’s main directory, create a directory called bin and create a file inside called www:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/d118a215-64e2-4fee-af86-9fd249b982fe)
This is essentially the index file that will be run first. The start script entered in package.json will run this file.


Create a file in the main directory called app.js:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/f52e7803-6ba9-4ecb-94c0-3a5742923926)
This file is mainly responsible for processing and directing HTTP requests. Body-parser takes the user input from the HTML form and parses it into a JavaScript object, placing it back in the request body for easy access. app.use(‘/’, router) sends every request to a routing file where responses are individually processed based on the requested address.


Create a file in the main directory called router.js:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/b4736170-5ee7-4f0b-aff4-67f4e462ea3a)
This file will be responsible for adding a user to the contact list and sending HTTP responses back to the browser. Requests to the home route (‘/’) will return the page containing the registration form.

Next, we can add another route called ‘/register’ that will be called when a user clicks the “register” button in the home page. This function sends the verification email to the user’s address. The HTML form input data is passed to the template: 

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/0552bb68-0966-4e82-a768-531d90344220)


The third function is called when the user clicks the “verify email” link in the verification email. This function takes in the user’s email as a URL parameter and adds the user to the newsletter contact list. The user is redirected to a confirmation page: 

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/55c9916b-07e3-42d0-ad4b-b3449c9915eb)


Export the router from the file:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/bc44f07d-73c6-49cf-8e43-66b3db7d98f8)


The two HTML pages are set up as follows:
public/register.html

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/a06dbbb8-c1c7-40f5-adc4-13108deb6d14)


public/verified.html

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/38077a49-6685-4d3d-b1d6-88e3252c2293)


Sending emails programmatically

Create a directory called ses_commands.

Create a file called ses_commands/sendVerificationEmail.js

Import the needed modules:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/a2b165b3-217f-4a06-ac92-e29e611c60fd)


Create an asynchronous wrapper function and export it:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/17179bba-4437-4385-a4c7-d0907b837dc3)


The rest of the code will be contained inside.


![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/62e7c2f6-8cfb-4d41-a667-858ec2d23e0a)


The input from the HTML form, which is in a JavaScript object up to this point, is converted to a JSON string:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/128c8140-293c-4d60-b3e3-e01a0b3638e4)


An input object is created to set configurations for the send templated email command. The template name identifies which template to use, and the JSON string is added as a property of “TemplateData”:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/beced8bd-6295-4e2a-a7a2-d32654e506de)


The input object is passed as an argument to sendTemplatedEmailCommand:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/151d4707-b770-40e3-9e2c-704e35863d78)


The instance of SendTemplatedEmailCommand is passed as an argument to the send() method of the SESClient:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/a13a2359-dc6b-4056-b5d9-1bf33c0c6af2)


Create another file to send a newsletter email.
ses_commands/sendNewsletterEmail.js:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/ef688821-6b3b-4907-8e42-154535082e3f)


ListContactsCommand is imported so that list can be used in the ToAddresses property of the input object.

Create a function to retrieve the list of contacts from the newsletter_recipients contact list:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/0ed0026a-506f-4d5e-a6b6-ce5182311ea3)
PageSize can be set to 1 for this demo since we only have 1 contact.
	
Create the wrapper function:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/8f7f9ddf-b967-403b-94dd-9c36192e8f9c)


The following is inside this wrapper function.

An array of articles is passed to the template instead of user input. This is the array that is looped over in the templating syntax:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/3aedf487-9c3d-4682-aed5-7cf4c5d9068f)

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/cc592b83-e346-49d1-af1f-1d3c3ec29fe4)


Create an array of email addresses for the input object:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/abca5e56-11c6-42fd-b81d-abaf76f4a7b8)


Define the input object:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/9c9284a1-e854-4d14-8c3a-b3ac8da1e784)


By adding the ListManagementOptions object, the unsubscribe link in the template will become active. By clicking on the link, the user can unsubscribe and will no longer receive emails.

Send the email:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/404826b6-3029-489e-bc89-37035623d4be)


Export the wrapper function:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/16a32b69-d140-49c7-ab36-f4d257ab58e7)


To replicate the practice of a newsletter, a file can be written to call this wrapper function at an interval.

Create a file: ses_commands/sendNewsletterInterval.js

Import the send newsletter program:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/3d9d3f0f-8cee-441f-9a70-21fd8a515014)


This is wrapped in the function emailInterval() so it can be called from the www file:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/fdeb1da9-ffd3-4252-a8e8-330a48ebe9af)

This email sending function will send emails at an interval of ten seconds.

This function needs to be imported into the www file so it can be automatically run when the server is started:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/87c538a5-87d9-449a-b3cb-8e1f1ae7a872)
The www file is invariably run because it’s the index file that starts the server. The other files are conditionally run, either when receiving an HTTP request or when performing some action against SES, so it wouldn’t work to call this function in any of the other files.


A working demo

Start with an empty contact list. In the ses_commands directory, run the following command:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/ac847c59-1ca0-4e26-8326-3502750c0206)


Run the following command to start the server:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/e3e94d7f-a13f-4d0a-b6b7-78a74e1d4a44)


Navigate to the home page (http://127.0.0.1:8000) in the browser and fill out the form:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/29a08ccf-3999-4fd9-93a2-7bd64a1fb0af)


Clicking submit redirects to the confirmation page:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/1e9987d6-7165-4252-b316-d6e359a22b38)


And a confirmation email appears in the inbox:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/9be3a80f-119e-4cf5-b5ff-d729047405e8)


My name appears in the email body:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/a1b93f65-a384-43f8-8100-c06ad0cad701)


Clicking the links redirects to another confirmation page:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/ae0d4c7a-3ee7-4474-8008-9193af4ffe9c)


By running logContacts again we can see that this address has been added to the contact list:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/8d671522-e27e-4e17-8170-f31e79c8b2b2)


Newsletter articles start coming in to the inbox:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/898dd882-674d-4abf-8b31-bd4722eca026)


They all contain a list of articles and an unsubscribe link:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/b9d30ef3-73ee-4618-84f0-eaf5d07e49ed)


The news links are active:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/a88e9799-b799-44f2-b47d-161c40f12376)


Clicking the unsubscribe link will redirect to this page:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/4b8a748b-99bd-4d5e-92e1-b0de727f4d03)


Selecting “Unsubscribe from all” and “Update” will unsubscribe the user:

![alt text](https://github.com/s-hatch/CSCIE-90_graduate_credit_assignment/assets/113044909/e9fffde6-2901-4384-8dd5-b8b5c3dbf799)
Note that UnsubscribeAll has been set to true, which means this contact is not subscribed to any topic or list and so will not receive emails.









