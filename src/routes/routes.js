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
        res.redirect('/home/0');
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
        cb(null, `${user.nombre} ${user.apat} ${user.amat}-${user.ci}.jpg`)
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
}).single('photo')

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
router.get('/home/:menu', async function (req, res, next) {
    var menu = req.params.menu
    switch (menu) {
        case '0':
            render(menu)
            break;
        case '1':
            render(menu)
            break;
        case '2':
            render(menu)
            break;
        case '3':
            render(menu)
            break;
        case '4':
            render(menu)
            break;
        default:
    }

    async function render(num) {
        if (req.isAuthenticated()) {
            const bd = await pool.query(`select * from personas,voluntarios,tipovoluntario 
            where personas.idpersona = voluntarios.idpersona and tipovoluntario.idtipo = voluntarios.idtipo and personas.idpersona = $1`, [req.user.idpersona])
            const datos = bd.rows[0]
            res.render('home', {
                title: "Home",
                menu: num,
                user: datos,
                file: `../photos/${datos.nombres} ${datos.apat} ${datos.amat}-${datos.ci}.jpg`
            });
            // console.log('home', req.user, datos)
        } else {
            res.redirect('/login');
        }
    }
});
//----------------------------------------------
async function insertarPersonas(nombres, apat, amat, email, telf, ci) {
    // await JSON.stringify(pool.query(`insert into personas (nombres,apat,amat,email,telf,ci,estado)
    //                         values('${nombres}','${apat}','${amat}','${email},'${telf}','${ci}','T'`))
    await JSON.stringify(pool.query(`insert into personas(nombres,apat,amat,email,telf,ci,estado)
    values('test','test','test','test','test','test','T')`))

}


router.post('/agregar', async function (req, res, next) {

    try {
        if (req.file == undefined || req.body.nombre == '' || req.body.apat == '' || req.body.amat == '' || req.body.email == '' || req.body.telf == '' || req.body.ci == '' || req.body.tipo == undefined) {
            console.log('1:', req.body, req.body.tipo)
            console.log('2:', req.file)
            req.flash('agregarPersona', 'Error: Todos los campos son necesarios.')
            res.redirect('/home/1');
        } else {
            req.flash('agregarPersona', 'Success.')
            res.redirect('/home/1');
        }
        // uploadPhoto(req, res, async (err) => {
        //     if (err) {
        //         // res.render('home', req.flash('agregarPersona', 'Error con la imagen'))
        //         req.flash('agregarPersona', 'Hubo un problema con el registro.')
        //         res.redirect('/home/1');
        //     }
        //     if (req.file == undefined || req.body.nombre == '' || req.body.apat == '' || req.body.amat == '' || req.body.email == '' || req.body.telf == '' || req.body.ci == '' || req.body.tipo == undefined) {
        //         console.log('1:', req.body, req.body.tipo)
        //         console.log('2:', req.file)
        //         req.flash('agregarPersona', 'Error: Todos los campos son necesarios.')
        //         res.redirect('/home/1');
        //     } else {
        //         const client = await pool.connect()
        //         await client.query('BEGIN')
        //         await JSON.stringify(client.query('SELECT * FROM personas WHERE ci=$1', [req.body.ci], function (err, result) {
        //             if (err) {
        //                 console.log(err);
        //             }
        //             if (result.rows[0]) {
        //                 req.flash('agregarPersona', 'Este usuario ya existe!')
        //                 res.redirect('/home/1');
        //             } else {
        //                 if (req.body.tipo == 'Voluntario') {
        //                     //nombres, apat, amat, email, telf, ci
        //                     console.log('asdasd', req.body);

        //                     insertarPersonas(req.body.nombre, req.body.apat, req.body.amat, req.body.email, req.body.telf, req.body.ci)
        //                     req.flash('agregarPersona', 'Voluntario.')
        //                     res.redirect('/home/1');

        //                     // await JSON.stringify(client.query(`insert into voluntarios (registro,idtipo,idpersona)
        //                     // values(${req.body.registro},${req.body.voluntario},${req.body.amat},${req.body.email},${req.body.telf},${req.body.ci},'T'`))
        //                 }
        //                 if (req.body.tipo == 'Adulto') {
        //                     req.flash('agregarPersona', 'Adulto.')
        //                     res.redirect('/home/1');
        //                 }

        //             }
        //         }));
        //         client.release();

        //     }
        // })
    } catch (error) {
        throw (error)
    }
});

module.exports = router