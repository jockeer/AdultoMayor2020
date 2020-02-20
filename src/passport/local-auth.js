const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const pool = require('../database')


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('local', new LocalStrategy({
    usernameField: 'usuario', //campos name
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        var currentAccountsData = await JSON.stringify(client.query('SELECT idcuenta,usuario,pass,idpersona,rol FROM cuentas WHERE usuario=$1', [username], function (err, result) {
            if (err) {
                console.log(err);
                return done(err)
            }
            if (result.rows[0] == null) {
                console.log('Usuario no encontrado.');
                console.log(req.body.usuario, req.body.password, password);

                return done(null, false, req.flash('loginMessage', 'Usuario no encontrado'));
            } else {
                if (result.rows[0].pass == password) {
                    console.log('Success');

                    return done(null, result.rows[0]); //datos que se envian a la vista
                } else {
                    console.log('Datos Incorrectos');
                    // console.log(req.body.usuario, req.body.password, password);
                    console.log(result.rows);
                    return done(null, false);
                }
            }
        }))

    } catch (e) {
        console.log(e)
        throw (e);
    }
}))