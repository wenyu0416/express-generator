const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operatin not support on /leaders');
    })
    .post((req, res, next) => {
        res.end('will add the leader: ' + req.body.name + ' with details ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('will delete all the leaders for you!');
    });
leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        res.end('Will send the details of leader ' + req.params.leaderId + ' to you!');
    })
    .put((req, res, next) => {
        res.write('Updating leader: ' + req.params.leaderId + '\n');
        res.end('will update the leader: ' + req.body.name + ' with details ' + req.body.description);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operatin not support on /leaders/:leaderId');
    })
    .delete((req, res, next) => {
        res.end('Deleting leader: ' + req.params.leaderId);
    });

module.exports = leaderRouter;