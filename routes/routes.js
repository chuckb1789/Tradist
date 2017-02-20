var sessionsModule = require('client-sessions');
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var NBastilleLibrary = require('./NBastilleLibrary.js')



module.exports = function (app) {

    mongoose.connect('mongodb://localhost/authdemo');

    var UserSchema = new mongoose.Schema({
        name:  String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        created: {
            type: Number,
            default: function(){ return Date.now() }
        }
    });

    var User = mongoose.model('User', UserSchema)

    var APP_DIR=process.env.APP_DIR

    app.get('*', function (req, res, next) {
        console.log(req.method, req.path)
        next();
    });

    var sessionsMiddleware = sessionsModule({
        cookieName: 'auth-cookie',  // front-end cookie name
        secret: 'DR@G0N$',        // the encryption password : keep this safe
        requestKey: 'session',    // we can access our sessions at req.session,
        duration: (86400 * 1000) * 7, // one week in milliseconds
        cookie: {
            ephemeral: false,     // when true, cookie expires when browser is closed
            httpOnly: true,       // when true, the cookie is not accesbile via front-end JavaScript
            secure: false         // when true, cookie will only be read when sent over HTTPS
        }
    }) // encrypted cookies!
    app.use(sessionsMiddleware)

    app.use(express.static(APP_DIR + '/public'));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(function(req,res,next){
        // remember: the 'session' property was added by the sessionsMiddleware
        console.log('req session', req.session)

        next()
    })

    var checkIfLoggedIn = function(req, res, next) {
        if( req.session.uid ) {
            console.info('User is logged in, proceeding to dashboard...');
            next();
        } else {
            console.warn('User is not logged in!')
            // note: res.redirect won't work for ajax requests!
            res.redirect('/');
        }
    }
    var checkIfLoggedInForAjax = function(req, res, next) {
        if( req.session.uid ) {
            console.info('User is logged in, proceeding to dashboard...');
            next();
        } else {
            console.warn('User is not logged in!')
            // note: res.redirect won't work for ajax requests!
            res.send('go home');
            // when angular receives that string, you can call window.location.href="/login"
        }
    }


    app.get('/', function(req, res) {
        res.sendFile('login.html', {root: APP_DIR +'/public'})
    })

    app.get('/register', function(req, res) {
        res.sendFile("register.html", {root: APP_DIR +'/public'})
    })

    app.get('/profile', checkIfLoggedIn, function(req, res){

        User.findOne({_id: req.session.uid}, function(err, user){
            res.sendFile('profile.html', {root: APP_DIR +'/public'})
            console.log("Sending to Profile Page");
        })
    });

    app.get('/routeFinder', checkIfLoggedIn, function(req, res){

        User.findOne({_id: req.session.uid}, function(err, user){
            res.sendFile('routeFinder.html', {root: APP_DIR +'/public'})
            console.log("Sending to Routes Page");
        })
    });

    app.get('/grade', checkIfLoggedIn, function(req, res){

        User.findOne({_id: req.session.uid}, function(err, user){
            res.sendFile('grade.html', {root: APP_DIR +'/public'})
            console.log("Sending to Grade Page");
        })
    });




    app.get('/whoami', checkIfLoggedInForAjax, function(req, res){
        User.findOne({_id: req.session.uid}, function(err, user){
            res.send(user)
        })
    })

    app.post('/register', function(req, res) {
        console.info('Register payload:', req.body);

        // this user object still has a plain-text password. we must hash the password before we store it.
        var newUser = new User(req.body);


            // generate a salt value to encrypt our password
        bcrypt.genSalt(11, (saltErr, salt) => { // used to guarentee uniqueness
            if(saltErr) { console.log(saltErr) }

            console.log('SALT generated!', salt);

            // now let's hash this bad boy!
            bcrypt.hash(newUser.password, salt, (hashErr, hashedPassword) => {
                if( hashErr ) { console.log(hashErr) } // check for errors
                // over-ride the plain text password with the hashed one
                newUser.password = hashedPassword;
                console.log(hashedPassword);

                newUser.save( function(saveErr, user) {
                    if( saveErr ) { res.status(500).send("Failed to save user") }
                    else {
                        req.session.uid = user._id; // this is what keeps our user session on the backend!
                        res.send({ message: 'Register success' }); // send a success message
                    }
                });
            });
        });

    });

        // logout route + redirect

    app.post('/login', function(req, res) { // form post submission
        console.info('auth.login.payload:', req.body);

        User.findOne({ email: req.body.email }, function(err, user) {
            if( err) {
                console.log('MongoDB error:'.red, err);
                res.status(500).send("failed to find user")
            }
            else if( !user ) {
                // forbidden
                console.log('No user found!');
                res.status(403).send("<h1>Login failed</h1>");
            } else {
                // at this point, we know they're trying to log in as someone who DOES exist in our database
                // but do they have the right password?
                console.log('auth.login.user', user);
                // at this point, user.password is hashed!
                bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched) {
                    // matched will be === true || false
                    if( bcryptErr ) {
                        console.error('MongoDB error:', bcryptErr);
                        res.status(500).send("mongodb error");
                    } else if ( !matched ) {
                        // forbidden, bad password
                        console.warn('Password did not match!');
                        res.status(403).send("failed to log in");
                    } else {
                        req.session.uid = user._id; // this is what keeps our user session on the backend!
                        res.send({ message: 'Login success' }); // send a success message
                    }
                });
            }
        });
    });         // login form submission

    app.get('/logout', function(req, res) {
        // the client-session middleware gives us access to the reset method
        req.session.reset(); // clears the users cookie session
        res.redirect('/');
    });

    app.get('/NBastille/routes', NBastilleLibrary.routes);

    // app.get('/NBastille/protection', NBastilleLibrary.protection);

};
