const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the promotions to you!');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operatin not support on /promotions');
    })
    .post((req, res, next) => {
        res.end('will add the promotion: ' + req.body.name + ' with details ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('will delete all the promotions for you!');
    });
promoRouter.route('/:promoId')
    .get((req, res, next) => {
        res.end('Will send the details of promotion ' + req.params.promoId + ' to you!');
    })
    .put((req, res, next) => {
        res.write('Updating promotion: ' + req.params.promoId + '\n');
        res.end('will update the promotion: ' + req.body.name + ' with details ' + req.body.description);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operatin not support on /promotions/:promoId');
    })
    .delete((req, res, next) => {
        res.end('Deleting promotion: ' + req.params.promoId);
    });

module.exports = promoRouter;