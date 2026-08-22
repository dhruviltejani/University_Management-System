const emailjs = require("@emailjs/nodejs");

const sendEmail = async (to, subject, resetLink) => {
  try {
    // We are now passing the raw resetLink to EmailJS. 
    // In your EmailJS template, you should use {{reset_link}} where you want the URL to appear.
    const templateParams = {
      to_email: to,
      subject: subject,
      reset_link: resetLink, 
    };

    // EmailJS requires Service ID, Template ID, and Public Key / Private Key
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // Needed for Node.js backend calls
      }
    );

    console.log("EmailJS response:", response.status, response.text);
    return response;
  } catch (error) {
    console.error("Error sending email with EmailJS:", error);
    throw error;
  }
};

module.exports = sendEmail;