const express = require('express');
const bodyParser = require('body-parser');

const mongooese = require('mongoose');

const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');

const leaderRouter = express.Router();
const cors = require('./cors');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(cors.cors, (req, res, next) => {
        Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operatin not support on /leaders');
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                res.statusCode = 201;
                console.log('leader Created', leader);
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

    });
leaderRouter.route('/:leaderId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200;
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
                $set: req.body
            }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operatin not support on /leaders/:leaderId');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = leaderRouter;