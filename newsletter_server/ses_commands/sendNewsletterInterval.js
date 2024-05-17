const sendEmail = require('./sendNewsletterEmail');

function emailInterval() {
    // Sends newsletter emails at an interval of 10 seconds
    setInterval(async () => {
        try {
            const response = await sendEmail();
            console.log(response);
        } catch(error){}
    }, 10000);
}

module.exports = emailInterval;