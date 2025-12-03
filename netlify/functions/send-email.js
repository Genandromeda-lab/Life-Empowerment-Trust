const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { name, email, message } = JSON.parse(event.body);

  try {
    await resend.emails.send({
      from: 'Life Empowerment Trust <noreply@lifeempowermenttrust.org>',
      to: 'lifeempowermenttrust@gmail.com',
      subject: 'New Message from Website',
      html: `<p><strong>${name}</strong> (${email}) says:</p><p>${message}</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email failed to send', details: error }),
    };
  }
};