const express = require('express');
const bodyParser = require('body-parser');
const mongooese = require('mongoose');

const Favorites = require('../models/favorites');
var authenticate = require('../authenticate');

const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operatin not support on /favorites');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        var formatFavorite = {};
        formatFavorite.user = req.user;
        formatFavorite.dishes = req.body;
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites != null) {
                    for (i = 0; i < formatFavorite.dishes.length; i++) {
                        if (favorites.dishes.indexOf(formatFavorite.dishes[i]._id) === -1)
                            favorites.dishes.push(formatFavorite.dishes[i]);
                    }
                    return favorites.save()
                        .then((favorites) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        }, (err) => next(err));
                } else {
                    return Favorites.create(formatFavorite)
                        .then((favorites) => {
                            res.statusCode = 201;
                            console.log('Favorites Created', favorites);
                            res.json(favorites);
                        }, (err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operatin not support on /favorites/:dishId');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operatin not support on /favorites/:dishId');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        var formatFavorite = {};
        formatFavorite.user = req.user;
        formatFavorite.dishes = req.params.dishId;
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites != null) {
                    if (favorites.dishes.indexOf(formatFavorite.dishes) === -1) {
                        favorites.dishes.push(formatFavorite.dishes);
                        return favorites.save()
                            .then((favorites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            }, (err) => next(err));
                    } else {
                        err = new Error('Dish ' + req.params.dishId + ' already in favorite list');
                        err.status = 400;
                        return next(err);
                    }
                } else {
                    return Favorites.create(formatFavorite)
                        .then((favorites) => {
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        var formatFavorite = {};
        formatFavorite.user = req.user._id;
        formatFavorite.dishes = req.params.dishId;
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites != null) {
                    if (favorites.dishes.indexOf(formatFavorite.dishes) === -1) {
                        err = new Error('Dish ' + req.params.dishId + ' not found in favorite list');
                        err.status = 404;
                        return next(err);
                    } else {
                        favorites.dishes.splice(favorites.dishes.indexOf(formatFavorite.dishes), 1);
                        favorites.save()
                            .then((favorites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            }, (err) => next(err));
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = favoriteRouter;