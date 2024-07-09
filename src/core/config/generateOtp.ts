import otpGenerator from 'otp-generator';

export  async function generateOtp ()
 {
    const otp = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    console.log('OTP généré :', otp);
    return otp
  };
  
  
