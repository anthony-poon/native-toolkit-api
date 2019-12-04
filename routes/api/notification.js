const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

router.post("/", (req, res, next) => {
    const {
        token,
        message
    } = req.body;
    if (!Expo.isExpoPushToken(token)) {
        throw "Invalid expo token."
    }
    const msg = {
        to: token,
        // android 7.0 , 6, 5 , 4 + iOS Only
        sound: 'default',
        body: message,
        data: {},
        // Android only
        channelId: "notification-app"
    };
    const chunks = expo.chunkPushNotifications([msg]);
    const tickets = chunks.map(async chunk => {
        try {
            const ticket = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(ticket);
        } catch (e) {
            console.log(e);
        }
    });
    res.json({
        status: "OK"
    })
});

// router.post("/tokens", (req, res, next) => {
//     const token = req.body;
//     res.json({
//         status: "ok"
//     })
// });

module.exports = router;