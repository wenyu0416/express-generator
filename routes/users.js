var express = require('express');
const bodyParser = require('body-parser');
const mongooese = require('mongoose');
var authenticate = require('../authenticate');

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
    console.log('req.user._id', req.user._id);
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ token: token, status: 'You are successfully logged in' });
}))

userRouter.post('/logout', (req, res, next) => {
    console.log(JSON.stringify(req.session, null, 2));


    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/')
    } else {
        res.redirect('/')
    }
})

module.exports = userRouter;