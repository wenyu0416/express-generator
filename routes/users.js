var express = require('express');
const bodyParser = require('body-parser');
const mongooese = require('mongoose');

const User = require('../models/users');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

var passport = require('passport');

/* GET users listing. */
// userRouter.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

userRouter.post('/signup', (req, res, next) => {
    User.register(new User({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                passport.authenticate('local')((req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ status: 'Registration Successfully', user: user });
                }));
            }
        })
})

userRouter.post('/login', passport.authenticate('local'), ((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 'You are successfully logged in' });
}))

userRouter.post('/logout', (req, res, next) => {
    console.log(JSON.stringify(req.session, null, 2));


    if (!req.session) {
        var err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    } else {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/')
    }
})

module.exports = userRouter;