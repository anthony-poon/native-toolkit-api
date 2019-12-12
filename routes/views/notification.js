const express = require('express');
const router = express.Router();
const devices = require('../../cache/push-devices');
const tickets = require('../../cache/message-tickets');
const _ = require('lodash');

router.get('/', function (req, res) {
    res.render('notification', { devices: _.values(devices) })
});

router.get('/tickets', function (req, res) {
    res.render('tickets', { tickets })
});

module.exports = router;