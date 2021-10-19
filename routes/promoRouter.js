const express = require('express');
const bodyParser = require('body-parser');

const mongooese = require('mongoose');

const Promotions = require('../models/Promotions');
var authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        Promotions.find({})
            .then((Promotions) => {
                res.statusCode = 200;
                res.json(Promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operatin not support on /Promotions');
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                res.statusCode = 201;
                console.log('promotion Created', promotion);
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

    });
promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                res.statusCode = 200;
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
                $set: req.body
            }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operatin not support on /Promotions/:promoId');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200;
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = promoRouter;