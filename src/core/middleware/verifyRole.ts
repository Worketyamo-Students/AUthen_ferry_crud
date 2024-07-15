import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { PrismaClient } from '@prisma/client';

import mytokens from '../config/tokensJwt';
import { HttpCode } from '../constants';

const prisma = new PrismaClient();

const Verifier = {
  verifyRole: (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Récupérer le jeton d'accès de la requête
        const accessToken = req.headers.authorization;

        // Vérifier et décoder le jeton d'accès
        const decodedToken: any = mytokens.verifyAccessToken(accessToken);

        // Vérifier le rôle de l'utilisateur
        if (decodedToken?.role !== role) {
          return res.status(HttpCode.FORBIDDEN).json({ message: 'Accès refusé, vous n\'avez pas les droits nécessaires pour cette action' });
        }

        // L'utilisateur a le rôle requis, passer à la prochaine middleware
        next();
      } catch (error) {
        console.error(error);
        return res.status(HttpCode.UNAUTHORIZED).json({ message: 'Jeton d\'accès non valide' });
      }
    };
  },
};

export default Verifier;