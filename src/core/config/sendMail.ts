import nodemailer from 'nodemailer';

async function sendmail(name: string, email: string, otp: number) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user:"youbiferry@gmail.com",
        pass:"ippk gdbh htai plwt",
      },
    });
   
    const info = await transporter.sendMail({
      from: '"ferry👻"<youbiferry@gmail.com>',
      to: email,
      subject: "Bienvenue a worketyamo!",
      text: `Bonjour ${name}, bienvenue sur notre plateforme !`,
      html: `<b style="font-size: 16px; color: green;">Bonjour ${name}, bienvenue sur notre plateforme !</b>
            <div style="font-size:16px">
              ${otp}
            </div>`,
    });
  
    console.log(`Message envoyé avec success l'otp est ${otp}` );
  }

  export default sendmail;