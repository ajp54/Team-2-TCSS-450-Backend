//Get the connection to Heroku Database
let pool = require("./sql_conn.js")

//We use this create the SHA256 hash
const crypto = require("crypto");

const nodemailer = require("nodemailer");

function sendEmail(from, receiver, subj, emailToken) {
 //research nodemailer for sending email from node.
 // https://nodemailer.com/about/
 // https://www.w3schools.com/nodejs/nodejs_email.asp
 //create a burner gmail account
 //make sure you add the password to the environmental variables
 //similar to the DATABASE_URL and PHISH_DOT_NET_KEY (later section of the lab)

 //fake sending an email for now. Post a message to logs.
 //console.log('Email sent: ' + message);

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    //type: 'Oauth2',
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

var mailOptions = {
  from: from,
  to: receiver,
  subject: subj,
  text: 'Your email was used for registration to the Team 2 TCSS 450 project app. If this was not you please ignore this email, and the link that follows.\n',
  html: '<p> Please click here to confirm your email: <a href="http://localhost:5000/verify?token=' + emailToken + '">here</a> Click to verify email.</p>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

/**
 * Method to get a salted hash.
 * We put this in its own method to keep consistency
 * @param {string} pw the password to hash
 * @param {string} salt the salt to use when hashing
 */
function getHash(pw, salt) {
 return crypto.createHash("sha256").update(pw + salt).digest("hex");
} 


module.exports = {
 pool, getHash, sendEmail 
}; 