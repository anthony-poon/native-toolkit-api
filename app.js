const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authAPI = require('./routes/api/auth');
const notificationAPI = require('./routes/api/notification');
const notificationView = require("./routes/views/notification");
const app = express();
const cors = require('cors');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use('/api/auth', authAPI);
app.use('/api/notifications', notificationAPI);
app.use('/views/notifications', notificationView);

module.exports = app;
