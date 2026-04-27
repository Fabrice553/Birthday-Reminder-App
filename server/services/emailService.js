const nodemailer = require('nodemailer');
const config = require('../config');
const Birthday = require('../models/birthdayModel');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Generate Birthday Email HTML
const generateBirthdayEmailHTML = (username) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 2.5em;
          font-weight: bold;
        }
        .balloons {
          font-size: 2em;
          margin-top: 10px;
        }
        .content {
          padding: 40px 20px;
          text-align: center;
        }
        .content p {
          font-size: 1.1em;
          color: #333;
          line-height: 1.6;
        }
        .content .name {
          font-size: 1.3em;
          font-weight: bold;
          color: #667eea;
          margin: 20px 0;
        }
        .cake {
          font-size: 3em;
          margin: 20px 0;
          animation: bounce 0.5s infinite;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 0.9em;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .button:hover {
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Happy Birthday! 🎉</h1>
          <div class="balloons">🎈 🎈 🎈</div>
        </div>
        <div class="content">
          <p>Dear <span class="name">${username}</span>,</p>
          <p>Today is YOUR day! We celebrate the amazing person you are.</p>
          <div class="cake">🎂</div>
          <p>Wishing you a day filled with joy, laughter, and wonderful moments with loved ones.</p>
          <p>May this year bring you:</p>
          <ul style="text-align: left; display: inline-block; margin: 20px 0;">
            <li>✨ New adventures and experiences</li>
            <li>❤️ Love and happiness</li>
            <li>🎯 Success in all your endeavors</li>
            <li>🌟 Health and prosperity</li>
          </ul>
          <p><strong>Happy Birthday once again! 🥳</strong></p>
        </div>
        <div class="footer">
          <p>Sent by Birthday Reminder App 🎁</p>
          <p style="margin-top: 10px; color: #999;">© 2026 Birthday Reminder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send Birthday Email
exports.sendBirthdayEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: `🎂 Happy Birthday, ${username}! 🎂`,
      html: generateBirthdayEmailHTML(username),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}:`, info.response);

    // Update the birthday record
    await Birthday.updateOne(
      { email },
      {
        emailSentToday: true,
        lastEmailSent: new Date(),
      }
    );

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
    throw error;
  }
};

// Send Batch Birthday Emails
exports.sendBatchBirthdayEmails = async (birthdays) => {
  const results = {
    success: [],
    failed: [],
  };

  for (const birthday of birthdays) {
    try {
      await exports.sendBirthdayEmail(birthday.email, birthday.username);
      results.success.push(birthday.email);
    } catch (error) {
      results.failed.push({
        email: birthday.email,
        error: error.message,
      });
    }
  }

  console.log(`📧 Email Results - Success: ${results.success.length}, Failed: ${results.failed.length}`);
  return results;
};

// Verify email transporter
exports.verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email transporter verified');
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error);
    return false;
  }
};