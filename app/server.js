import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { fileURLToPath } from 'url';
import {routes as authRoutes} from './auth/routes.js'
import {routes as snippetRoutes} from './snippets/routes.js'
import { isAuthenticated } from './auth/controller.js'

const app = express();
const port = 3000;
dotenv.config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MongoStore = connectMongo(session);

app.use(session({
  secret: 'idkwhatthisdoesngl', 
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connections[0] })
}));


// database
await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ktdpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(publicPath, 'views', 'dashboard.html'));
})

// auth & snippet routes
app.use('/', authRoutes);
app.use('/', snippetRoutes);

export function start() {
  app.listen(port, () => {
    console.log('Listening at http://localhost')
  })
}
