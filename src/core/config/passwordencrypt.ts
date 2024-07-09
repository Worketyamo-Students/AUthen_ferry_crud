import bcrypt from 'bcrypt';
// utilisationde bcrypt pour crypter le mot de passe de l'utilisateur
export async function encryptPassword(password: string): Promise<string> {

  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);
  
  console.log('Hash du mot de passe :', hashedPassword);
  
  return hashedPassword;
}