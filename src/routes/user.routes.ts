import { Router } from 'express';

import userController from '../controllers/users.controller';
import { verifyOtp } from '../core/config/verifyOtp';

const routeUser = Router()


routeUser.get('/user', userController.getUsers)
routeUser.get('/user/:id', userController.getOneUser)
routeUser.post('/user', userController.registerUser)
routeUser.delete('/user', userController.deleteUsers)
routeUser.post('/verify', verifyOtp);
routeUser.post('/userlogin/login', userController.UserLogin)




export default routeUser