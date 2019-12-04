const express = require('express');
const router = express.Router();

router.get('/:token', function (req, res) {
    const token = req.params.token;
    res.render('notification', { token: token })
});

module.exports = router;