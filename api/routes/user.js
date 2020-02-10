const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secretKey = 'secret'

router.post('/signup', (req, res, next) => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                  return res.status(500).json({
                        error: err
                  });
            }
            else {
                  const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  password: hash
                  });
                  user.save()
                  .then(result => {
                        res.status(201).json({
                              message: 'User created',
                              user: user
                        })
                  })
                  .catch(err => {
                        res.status(500).json({
                              error: err
                        })
                  })
            }
      })
}) 

router.post('/login', (req, res, next) => {
      User.find({email: req.body.email}).exec()
      .then(user => {
         if(user.length < 1){
               return res.status(401).json({
                     message:'Auth failed'
               })
         }
         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
               if(!result){
                     return res.status(401).json({
                           message: 'Auth failed 2'
                     })
               }
               if(result){
                     const token = jwt.sign({
                           email: user[0].email,
                           userId: user[0]._id
                     },
                     secretKey,
                     {
                           expiresIn: '1h'
                     },

                     )
                     return res.status(200).json({
                           message: 'Auth successful',
                           token:token
                     })
               }
         })
      })
      .catch(err => {
            console.log(err);
            res.status(500).json({
                  error: err
            })
      })
})






router.delete('/:userId', (req, res, next) => {
      User.deleteOne({_id: req.params.userId}).exec()
      .then(doc => {
            res.status(200).json({
                  message: 'User Deleted'
            })
      })
      .catch(err => {
            console.log(err)
            res.status(500).json({
                  error: err 
            })
      })
})

module.exports = router;