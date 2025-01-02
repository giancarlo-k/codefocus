import {Router} from 'express';
import { logout, deleteAccount, redirectIfAuthenticated, showLogin, showSignup, authenticateUser, createUser } from './controller.js'
export const routes = new Router();

// get requests
routes.get('/', redirectIfAuthenticated, showLogin);
routes.get('/login', redirectIfAuthenticated, showLogin);
routes.get('/signup', redirectIfAuthenticated, showSignup);
routes.get('/logout', logout);
routes.get('/deleteaccount', deleteAccount);

// post requests
routes.post('/login', authenticateUser);
routes.post('/signup', createUser);