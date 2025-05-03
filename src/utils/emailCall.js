import nodemailer from "nodemailer";
const registerUserSendEmail = async (hashedToken, fullname, email) => {
  const mailOption = {
    from: process.env.MAILTRAP_SenderMail, // sender address
    to: email, // reciver email i choise user email
    subject: "Verification mail", // Subject line
    text: `please click following link for verify email if u not register not click
          ${process.env.BASE_URL}/api/v1/users/verify-email/${hashedToken}`, // plain text body
    html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Verify Email</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                background-color: #fff;
                padding: 30px;
                margin: auto;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .btn {
                background-color: #007bff;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Verify Your Email Address</h2>
              <p>Hello ${fullname || "there"},</p>
              <p>Thank you for signing up. Please click the button below to verify your email:</p>
              <a href="${
                process.env.BASE_URL
              }/api/v1/users/verify-email:${hashedToken}" class="btn">Verify Email</a>
              <p>If you did not request this, please ignore this message.</p>
              <div class="footer">
                <p>&copy; 2025 LetsCode</p>
              </div>
            </div>
          </body>
          </html>`, // html body
  };
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  const forgotPasswordSendEmail = () => {
    const mailOption = {
      from: process.env.MAILTRAP_SenderMail, // sender address
      to: email, // reciver email i choise user email
      subject: "Verification mail", // Subject line
      text: `please click following link for verify email if u not register not click
            ${process.env.BASE_URL}/api/v1/users/verify-email/${hashedToken}`, // plain text body
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Verify Email</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  background-color: #fff;
                  padding: 30px;
                  margin: auto;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .btn {
                  background-color: #007bff;
                  color: white;
                  padding: 12px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  display: inline-block;
                  margin-top: 20px;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Verify Your Email Address</h2>
                <p>Hello ${fullname || "there"},</p>
                <p>Thank you for signing up. Please click the button below to verify your email:</p>
                <a href="${
                  process.env.BASE_URL
                }/api/v1/users/verify-email:${hashedToken}" class="btn">Verify Email</a>
                <p>If you did not request this, please ignore this message.</p>
                <div class="footer">
                  <p>&copy; 2025 LetsCode</p>
                </div>
              </div>
            </body>
            </html>`, // html body
    };
  };
  await transporter.sendMail(mailOption);
};

export { registerUserSendEmail, forgotPasswordSendEmail };
