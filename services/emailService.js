const nodemailer = require('nodemailer');
const { patch } = require('../routes/admin');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: '587',
  secure: false, 
  auth: {
    user: 'eddyrm.93@gmail.com',
    pass: 'yxhdpgqgzgcqmazw'
  }
})

const sendMail = (name, email) => {
  let msgHTML  = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you</title>
    <style>
      main{
        width: fit-content;
        border: 3px solid #0D1821;
        margin-inline: auto;
      }
  
      h1 {
        text-align: center;
        margin-inline: 16px;
      }
      img {
        max-width: 400px;
      }
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
  
      button {
        cursor: pointer;
        background-color: white;
        border: 2px solid #0D1821;
        border-radius: 50px;
        font-size: 1.3rem;
        margin-block: 16px;
        padding-inline: 16px;
        padding-block: 5px;
        box-shadow: 10px 10px #0D1821;
        transition: translate 0.2s, box-shadow 0.2s;
      }
  
      button:active {
        translate: 10px 10px;
        box-shadow: none;
      }
    </style>
  </head>
  <body>
      <main>
        <h1>Thank you for Joinin Rarity Realm</h1>
        <div>
          <img src="../public/images/assets/vaseblue.png" alt="">
          <button onclick="window.location.href='http://localhost:3000/'">Go to Rarity-Realm</button>
        </div>
      </main>
  </body> 
  </html>`

  transporter.verify().then(console.log).catch(console.error);

  const info = transporter.sendMail({
    from: 'Eduardo <eddyrm.93@gmail.com>',
    to: email,
    subject: "Bienvenido a Rarity Realm",
    html: msgHTML, 
    attachments: 
      {
        filename: 'vaseblue.png',
        path: './public/images/assets/vaseblue.png',
        cid: 'foto'
      }
  })

  info.then(res => console.log(res)).catch(err => console.log(err));
}

module.exports = sendMail;