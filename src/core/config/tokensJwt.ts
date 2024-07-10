import jwt from 'jsonwebtoken';

import { envs } from './env';

const mytokens = {
    // Générer un jeton d'accès
    generateAccessToken: (payload) => {
        try {
            return jwt.sign({ payload}, envs.MY_JWT_ACCES_TOKEN, { expiresIn: '1h' });
        } catch (error) {
            console.error( error);
        }
    
    },
    //verifier le jeton d'acces

    verifyAccessToken: (token: string) => {
      try {
        return jwt.verify(token, envs.MY_JWT_ACCES_TOKEN as string);
      } catch (error) {
        console.error( error);
      }
    },
    // décoder le jeton d'acces

    decodeAccessToken: (token: string) => {
      try {
        return jwt.decode(token) as { user: string };
      } catch (error) {
        console.error(error);
      
      }
    },
   // generer le refresh token 
    generateRefreshToken: (payload) => {

          try {
            return jwt.sign({ payload }, envs.MY_JWT_REFRESH_TOKEN, { expiresIn: '30d' });
          } catch (error) {
            console.error(error);
          }
   
    },
  // verifier 

    verifyRefreshToken: (token: string) => {
      try {
        return jwt.verify(token, envs.MY_JWT_REFRESH_TOKEN as string);
      } catch (error) {
        console.error(error);
      }
    },
  // décoder 

    decodeRefreshToken: (token: string) => {
      try {
        return jwt.decode(token) as { user: string };
      } catch (error) {
        console.error(error);
      }
    }
  };

export default mytokens


