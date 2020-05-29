//Get the connection to Heroku Database
let pool = require("./sql_conn.js")

//We use this create the SHA256 hash
const crypto = require("crypto");

const nodemailer = require("nodemailer");

function sendEmail(from, receiver, subj, emailToken) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      //type: 'Oauth2',
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
  });

  let mailOptions = {
    from: from,
    to: receiver,
    subject: subj,
    text: 'Your email was used for registration to Shoot the Breeze. If this was not you please ignore this email, and the link that follows.\n',
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

function sendPassword(from, receiver, subj, emailToken) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      //type: 'Oauth2',
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
  });

  let mailOptions = {
    from: from,
    to: receiver,
    subject: subj,
    text: 'A request was made through Shoot the Breeze to recover your password, if this was not you please ignore and/or delete this email.\n',
    attachments: [{
      filename: 'ShootTheBreezeLogo.png',
      path: __dirname + '/ShootTheBreezeLogo.png',
      cid: 'logo'},
    {
      filename: 'ShootTheBreezeLogo2.png',
      path: __dirname + '/ShootTheBreezeLogo2.png',
      cid: 'logo2'
    }],
    html: '<img src="cid:logo" alt="Shoot the Breeze Logo" width="180" height="150" style="vertical-align:bottom"><p> Please click here to get a new temporary email to Shoot the Breeze: <a href="https://team-2-tcss-450-backend.herokuapp.com/temp_pass?token=' + emailToken + '"><img src="cid:logo2" alt="Shoot the Breeze Logo" width="30" height="25" style="vertical-align:bottom"></a> Click to get a new temporary password.</p>'
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
 pool, getHash, sendEmail, sendPassword, messaging
};
