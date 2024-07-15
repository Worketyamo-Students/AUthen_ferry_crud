import { Router } from 'express';

import userController from '../controllers/users.controller';
import { verifyOtp } from '../core/config/verifyOtp';
import validateInputUser from '../core/middleware/validator';
import Verifier from '../core/middleware/verifyRole';

const routeUser = Router()


routeUser.get('/user',Verifier.verifyRole('admin'), userController.getUsers)
routeUser.get('/user/:id', userController.getOneUser)
routeUser.post('/user', userController.registerUser)
routeUser.delete('/user',validateInputUser, userController.deleteUsers)
routeUser.post('/verify', verifyOtp);
routeUser.post('/userlogin/login', userController.UserLogin)
routeUser.get('/userRefresh',userController.RefreshAtoken)




export default routeUser