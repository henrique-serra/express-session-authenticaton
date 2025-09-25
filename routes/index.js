const router = require('express').Router();
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');
const pool = require('../db/pool');
const strategy = require('../config/passport');
const db = require('../db/queries');
const { isAuth, isAdmin } = require('./authMiddleware');

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/login-success',
        failureRedirect: '/login-failure'
    })
);

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await db.insertUser(username, password);
        console.log(user);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        throw error;
    }
});

router.get('/', (req, res) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/login', (req, res) => {
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
});

router.get('/register', (req, res) => {
    const form = '<h1>Register Page</h1><form method="post" action="register">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
});

router.get('/protected-route', isAuth, (req, res) => {
    res.send('You made it to the route');
});

router.get('/admin-route', isAdmin, (req, res) => {
    res.send('You made it to the admin route');
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/protected-route');
    });
});

router.get('/login-success', (req, res) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res) => {
    res.send(`You entered the wrong password.`);
});

module.exports = router;