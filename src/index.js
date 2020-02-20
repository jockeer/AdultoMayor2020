const express = require('express')
const engine = require('ejs-mate')
const path = require('path')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

// initializations
const app = express()
require('./database')
require('./passport/local-auth')

// settings
app.set('views', path.join(__dirname, 'views')) //ruta de views
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)

// middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({
    extended: false
}))
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
//---------------------------------------------------------
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//---------------------------------------------------------

// routes
app.use('/', require('./routes/routes'))
app.use('/public', express.static(__dirname + '/public'))
app.use('/photos', express.static(__dirname + '/photos'))

// starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})