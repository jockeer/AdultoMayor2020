const express = require('express')
const router = express.Router()
const passport = require('passport')
const pool = require('../database')
const multer = require('multer')
const path = require('path')
const upload = multer()

//-------------ROUTES-------------------
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        res.render('index', {
            title: "Login",
            userData: req.user
        });
    }
});
//-------------UPLOAD PHOTOS------------------
//Set Storage Engine
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../photos'),
    filename: function (req, file, cb) {
        const user = req.body
        // console.log(user.email)
        cb(null, user.usuario + '.jpg')
    }
})

const uploadPhoto = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).single('myPhoto')

function checkFileType(file, cb) {
    //extenciones permitidas
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    //check mime type
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!')
    }
}
//----------------------------------------------
router.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        res.render('index', {
            title: "Login",
            user: req.user
        });
    }

});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
}), function (req, res) {
    if (req.body.remember) {
        console.log('remember')
        req.session.cookie.expires = false; // Cookie expires at end of session
    } else {
        req.session.cookie.maxAge = 5000; // Cookie expires after 5 seconds
    }

    res.redirect('/');
});
//----------------------------------------------
router.get('/home', async function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('home', {
            title: "Home",
            menu: 2,
            user: req.user,
            file: `photos/${req.user.email}.jpg`
        });
        console.log(req.user)
    } else {
        res.redirect('/login');
    }
});
//----------------------------------------------
router.get('/agregar', async function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('agregarPersona', {
            title: "Agregar Personas",
            user: req.user,
            file: `photos/${req.user.email}.jpg`
        });
        console.log(req.user)
    } else {
        res.redirect('/login');
    }
});

module.exports = router