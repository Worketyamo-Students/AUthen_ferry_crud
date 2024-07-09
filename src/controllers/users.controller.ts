import {
  Request,
  Response,
} from 'express';
import validator from 'validator';

import { PrismaClient } from '@prisma/client';

import { generateOtp } from '../core/config/generateOtp';
import { encryptPassword } from '../core/config/passwordencrypt';
import sendmail from '../core/config/sendMail';
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
            //utilisation de validator pour verifier si les champs email et mot de passe sont correcte

            if(!validator.isEmail(email)) {
                res.json({msg:"entrez un email valide "})
            }
            else{  
                const exitEmail = await prisma.users.findUnique({ where: { email } });
                if (exitEmail) {
                    return res.status(HttpCode.NOT_FOUND).json({ msg:"Email déjà utilisé" });
                }
            }
    
            if(!validator.isStrongPassword(password)) {
                res.json({msg:"entrez un password valide"})
            }
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
                    codeotp: Intotp, // OTP
                    expired_at: new Date(Date.now() + 10 * 60 * 1000), // Expiration dans 10 minute           
                    }
                         
            })
             user.password=""
             res.status(HttpCode.CREATED).json(user);
            await sendmail(user.name, user.email, Intotp)
        } 
        catch (error) {

            console.error(error)
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