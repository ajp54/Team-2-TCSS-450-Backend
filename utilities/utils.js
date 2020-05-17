//Get the connection to Heroku Database
let pool = require("./sql_conn.js")

//We use this create the SHA256 hash
const crypto = require("crypto");

const nodemailer = require("nodemailer");

function sendEmail(from, receiver, subj, emailToken) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      //type: 'Oauth2',
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
  });

  var mailOptions = {
    from: from,
    to: receiver,
    subject: subj,
    text: 'Your email was used for registration to the Team 2 TCSS 450 project app. If this was not you please ignore this email, and the link that follows.\n',
    html: '<p> Please click here to confirm your email: <a href="https://team-2-tcss-450-backend.herokuapp.com/verify?token=' + emailToken + '">here</a> Click to verify email.</p>'
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

let messaging = require('./pushy_utilities.js')
module.exports = {
 pool, getHash, sendEmail, messaging
};