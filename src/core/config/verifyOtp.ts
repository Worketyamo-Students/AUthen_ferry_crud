import {
  Request,
  Response,
} from 'express';

import { PrismaClient } from '@prisma/client';

import { HttpCode } from '../constants';

const prisma = new PrismaClient()

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(HttpCode.NOT_FOUND).json({ msg: 'Utilisateur non trouvé' });
    }
    // Vérifier si l'OTP est valide
    if (user.codeotp === parseInt(otp) && user.expired_at > new Date()) {

     ;
     const newuser= await prisma.users.update(
        {
          where: { email },
          data: {
            codeotp: null, // Supprimer l'OTP
            expired_at: null, // Supprimer l'expiration
            expired:true
          },
        }

    )

    return res.status(HttpCode.OK).json({ newuser })
      
    } else {

      await prisma.users.delete({ where: { email } })
      return res.status(HttpCode.UNAUTHORIZED).json({ msg: 'OTP invalide ou expiré veillez réessayer' });
    }
  } catch (error) {
    console.error(error);
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: 'Erreur interne' });
  }
};