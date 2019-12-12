const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const devices = require("../../cache/push-devices");
const tickets = require("../../cache/message-tickets");
const _ = require("lodash");

router.post("/tokens", (req, res) => {
    const {
        name,
        token,
    } = req.body;
    devices[token] = {
        name,
        token
    };
    res.json({
        status: "OK"
    })
});

router.post("/", async (req, res, next) => {
    const {
        token,
        message,
        channelId,
        data
    } = req.body;
    if (!Expo.isExpoPushToken(token)) {
        throw "Invalid expo token."
    }
    const msg = {
        to: token,
        // iOS Only
        _displayInForeground: true,
        // android 7.0 , 6, 5 , 4 + iOS Only
        sound: 'default',
        body: message,
        data: !!data ? data : {},
    };
    // Android only. Append to message if channel id is provided
    if (!!channelId) {
        msg["channelId"] = channelId;
    }
    const chunks = expo.chunkPushNotifications([msg]);
    try {
        const responses = await Promise.all(chunks.map(async (chunk) => await expo.sendPushNotificationsAsync(chunk)));
        const ticket = responses[0][0];
        tickets.push(ticket);
        res.json({
            status: "ok",
            ticket
        });
    } catch (e) {
        console.log(e);
        res.json({
            status: "error",
        })
    }
});

router.get("/tickets", (req, res, next) => {
    res.json({
        tickets
    })
});

router.get("/tickets/:id", async (req, res, next) => {
    const ticketId = req.params.id;
    const chunks = expo.chunkPushNotificationReceiptIds([ticketId]);
    const responses = await Promise.all(chunks.map(async (chunk) => await expo.getPushNotificationReceiptsAsync(chunk)));
    console.log(responses);
    res.json({
        id: ticketId,
        receipt: responses[0]
    })
});


module.exports = router;