import bcrypt from 'bcrypt';
import {
  Request,
  Response,
} from 'express';

import { PrismaClient } from '@prisma/client';

import { generateOtp } from '../core/config/generateOtp';
import { encryptPassword } from '../core/config/passwordencrypt';
import sendmail from '../core/config/sendMail';
import mytokens from '../core/config/tokensJwt';
import { HttpCode } from '../core/constants';

const prisma = new PrismaClient();

const userController = {

    getUsers: async (req: Request, res: Response) =>{
        
        try {
            const users =  await prisma.users.findMany()
            res.json(users).status(HttpCode.OK)
        } catch (error) {
            console.error(error)
        }
    },
    getOneUser: async (req:Request, res:Response) => {

        try {
            const {id}=req.params
            const user = await prisma.users.findUnique(
                {
                    where: {
                        user_id: id
                    }
                }
            )
            
        } catch (error) {
            console.error(error)
        }
    },
    registerUser: async(req:Request, res:Response)=>{
     
        try {
            const {name, email, password} = req.body
                // appel de la fonction encryptpassword  pour le cryptage du mot de passe 

            const encryptedPassword = await encryptPassword(password)

            // Renvoyer une réponse avec les informations de l'utilisateur créé
          
           // generation de l'otp

            const otp  = await generateOtp();
            const Intotp = parseInt(otp)
          

            // creation de l'utilisateur dans la base de données
            const user = await prisma.users.create({
                data: {
                    name,
                    email,
                    password:encryptedPassword,
                    codeotp:{
                        
                        otp: Intotp, // OTP
                        expired_at: new Date(Date.now() + 10 * 60 * 1000), // Expiration dans 10 minute  
                        expired: false
                    }          
                    }
                         
            })
             res.status(HttpCode.CREATED).json(user);
            await sendmail(user.name, user.email, user.codeotp.otp)
            
        } 
        catch (error) {

            console.error(error)
        }
    
    },
/////////login de l'utilisateur 
    UserLogin: async (req:Request, res:Response)=>{

        try {
            const {email, password} = req.body
        const user = await prisma.users.findUnique({
                where: {
                    email
                }
                })

                console.log(user)
        if(user){
            const comparePass = await bcrypt.compare(password, user.password)// veryfication du mot de passe 
            if(comparePass){
                  // generation du token d'acces
                  const accessToken = mytokens.generateAccessToken(user);
                  const refreshToken = mytokens.generateRefreshToken(user);
                 // création du refresh token
              
                  res.cookie("syfecca", refreshToken, { httpOnly: true, secure: true })
                  res.header ( 'Authorization' , accessToken)
                  res.json({msg:"connection reussie"})
            }
            else{
                res.status(HttpCode.UNAUTHORIZED).json({msg:"mot de passe incorrecte"})
            }
        }// else{ res.json({msg:"cet utilisateur n'existe pas"}).status(HttpCode.NOT_FOUND)}

        } catch (error) {
            console.error(error)
        }
        

     },
     RefreshAtoken: async (req:Request, res:Response)=>{
        const refreshToken = req.cookies.syfecca;
  
        if (!refreshToken) {
          return res.status(HttpCode.UNAUTHORIZED).json({ msg: 'Aucun jeton d actualisation trouvé' });
        }
      
        try { 
          const decodedR = mytokens.verifyRefreshToken(refreshToken)
          const newAccessToken = mytokens.generateAccessToken(decodedR)
          res.header('Authorization', newAccessToken) 
          res.send(decodedR); 
        } catch (error) { 
          console.error(error)
          return res.status(HttpCode.UNAUTHORIZED).json({ msg: 'Jeton d actualisation non valide' });
        } 
     },
    
    deleteUsers: async (req: Request, res: Response) => {
        try{
                    await prisma.users.deleteMany({})
                    res.status(HttpCode.NO_CONTENT).json({msg:"tous les utilisateurs ont été supprimés"})
        }
        catch(error){
          console.error(error)
        }
    }
}

export default userController

