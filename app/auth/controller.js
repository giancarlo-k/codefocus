import { User } from './model.js';
import { compare, hash } from './crypt.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url) // full path to controller.js
const __dirname = path.dirname(__filename) // full path to auth folder
// just add file name
const pathToAuthHTML =  path.join(__dirname, '..', '..', 'public', 'views')

export const showLogin = (req, res) => {
  res.sendFile(path.join(pathToAuthHTML, 'login.html'))
}

export const showSignup = (req, res) => {
  res.sendFile(path.join(pathToAuthHTML, 'signup.html'))
}

// authentication

export const createUser = async (req, res) => {
  const { username: plainUsername, password: plainText } = req.body;

  const username = plainUsername.toLowerCase()

  const isDuplicate = await User.findOne({ username });

  if (isDuplicate) {
    return res.status(409).json({ error: 'Username taken' });
  }
  
  await User.create({
    username: username,
    password: await hash(plainText)
  })

  req.session.user = { username };
  
  return res.status(200).json({ success: true })
}

export const authenticateUser = async (req, res) => {
  const { username, password: plainText, rememberMe } = req.body;

  // finding match
  const user = await User.findOne({
    username: username.toLowerCase()
  })

  if (!user) {
    return res.status(404).json({ error: 'Username not found' })
  }

  if (await compare(plainText, user.password)) {
    req.session.user = { username };

    if (rememberMe === true) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.maxAge = null;
    }

    return res.status(200).json({ success: true })
  } else {
    return res.status(400).json({ error: 'Incorrect password' })
  }
}

// check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  if (req.session.user) {
    return next()
  }

  if (req.session.cookie.maxAge && req.session.user) {
    return next();
  }

  res.redirect('/')
}

// if a user IS authenticated, disable from going to login or signup page
export const redirectIfAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  res.redirect('/dashboard');
}

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}

export const deleteAccount =  async (req, res) => {
  await User.deleteOne({ username: req.session.user.username });
  req.session.destroy();
  res.redirect('/');
}

// deletes all user entries in the DB

// async function deleteAllUsers() {
//   await User.deleteMany({});
// }

// deleteAllUsers()
