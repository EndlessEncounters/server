const express = require('express');
const path = require('path');
const UserService = require('./user-service');
const {v4:uuid} = require('uuid');

const userRouter = express.Router();
const jsonBodyParser = express.json();
userRouter.route('/story/:id').get(jsonBodyParser, async (req,res,next)=>{
  const db = req.app.get('db');
  const {id} = req.params;
  const data = await UserService.getUserGameData(db, id);
  if(!data)
  {
    return res.status(400).json({Error:"Denied"})
  }
  return res.status(200).json(data);

})
userRouter
  .route('/')
  .post(jsonBodyParser, async (req, res, next) => {
    const { email, password, username } = req.body;

    for (const field of ['email', 'username', 'password']) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field} in request body`
        });
      }
    }

    try {
      const passwordError = UserService.validatePassword(password);
      if (passwordError) return res.status(400).json({ error: passwordError });

      const hasUsername = await UserService.hasUserWithUserName(req.app.get('db'), username);
      if (hasUsername) return res.status(400).json({ error: 'Username already taken' });

      const hashedPassword = await UserService.hashPassword(password);

      const newUser = {
        email,
        username,
        password: hashedPassword,
        access_token:uuid()

      }

      const user = await UserService.insertUser(req.app.get('db'), newUser);

      res.status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UserService.serializeUser(user))
    } catch (error) {
      next(error);
    }
  });

  module.exports = userRouter;