const express = require('express')
const router = express.Router()
const passport = require('passport')
const pool = require('../database')
const multer = require('multer')
const path = require('path')
const upload = multer()

let validarImagen = false

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
        if (user.nombre != '' || user.apat != '' || user.amat != '' || user.email != '' || user.telf != '' || user.ci != '') {
            // if (validarImagen) {
            cb(null, `${user.nombre} ${user.apat} ${user.amat}-${user.ci}.jpg`)
        } else {
            cb('Error en el formulario.')
        }
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

async function buscarPersona(ci) {
    await JSON.stringify(pool.query('SELECT * FROM personas WHERE ci=$1', [ci]));
}
async function insertarPersonas(nombres, apat, amat, email, telf, ci) {
    await JSON.stringify(pool.query(`insert into personas (nombres,apat,amat,email,telf,ci,estado)
                            values('${nombres}','${apat}','${amat}','${email}','${telf}','${ci}','T')`))

}
async function insertarVoluntarios(registro, idtipo, idpersona) {
    await JSON.stringify(client.query(`insert into voluntarios (registro,idtipo,idpersona)
                            values('${registro}','${idtipo}','${idpersona}')`))
}
async function insertarAdultos(idpersona) {
    await JSON.stringify(client.query(`insert into voluntarios (idpersona)
                            values('${idpersona}')`))
}


router.post('/agregar', async function (req, res, next) {

    uploadPhoto(req, res, async (err) => {
        if (err) {
            // console.log(err);
            req.flash('agregarPersona', err)
            res.redirect('/home/1');
        } else {
            const body = req.body
            const file = req.file
            if (body.nombre == '' || body.apat == '' || body.amat == '' || body.email == '' || body.telf == '' || body.ci == '' || body.tipo == undefined) {
                console.log('1:', body)
                console.log('2:', req.file)
                req.flash('agregarPersona', 'Error: Todos los campos son necesarios.1')
                res.redirect('/home/1');
            } else {
                if (body.tipo == 'Voluntario') {
                    if (body.registro == '' || body.rol == undefined || body.voluntario == undefined || file == undefined) {
                        req.flash('agregarPersona', 'Error: Todos los campos son necesarios.2')
                        res.redirect('/home/1');
                    } else {
                        await pool.query('SELECT * FROM personas WHERE ci=$1', [body.ci], async function (err, result) {
                            if (result.rows[0]) {
                                req.flash('agregarPersona', 'Este usuario ya existe!')
                                res.redirect('/home/1');
                            } else {
                                await pool.query('SELECT * FROM voluntarios WHERE registro=$1', [body.registro], async function (err, result) {
                                    if (result.rows[0]) {
                                        req.flash('agregarPersona', 'Este registro ya existe!')
                                        res.redirect('/home/1');
                                    } else {
                                        await pool.query('insert into personas (nombres,apat,amat,email,telf,ci,estado) values($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                                            [body.nombre, body.apat, body.amat, body.email, body.telf, body.ci, 'T'], async (err, resP) => {
                                                if (resP.rows[0]) {
                                                    const persona = resP.rows[0]
                                                    await pool.query('insert into voluntarios (registro,idtipo,idpersona) values($1,$2,$3) returning *', [body.registro, body.voluntario, persona.idpersona])
                                                    req.flash('agregarPersona', 'Registro Exitoso!')
                                                    res.redirect('/home/1');
                                                }
                                            })
                                    }
                                });
                            }
                        });
                    }
                }
                if (body.tipo == 'Adulto') {
                    console.log('1:', body)
                    console.log('2:', req.file)
                    await pool.query('SELECT * FROM personas WHERE ci=$1', [body.ci], async function (err, result) {
                        if (result.rows[0]) {
                            req.flash('agregarPersona', 'Este usuario ya existe!')
                            res.redirect('/home/1');
                        } else {

                            await pool.query('insert into personas (nombres,apat,amat,email,telf,ci,estado) values($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                                [body.nombre, body.apat, body.amat, body.email, body.telf, body.ci, 'T'], async (err, resP) => {
                                    if (resP.rows[0]) {
                                        const persona = resP.rows[0]
                                        await pool.query('insert into adultos (idpersona) values($1) returning *', [persona.idpersona])
                                        req.flash('agregarPersona', 'Registro Exitoso!')
                                        res.redirect('/home/1');
                                    }
                                })
                        }
                    });
                }
            }
        }
    })
    // try {
    //     const body = req.body
    //     const file = req.file
    //     console.log(body)
    //     if (body.nombre == '' || body.apat == '' || body.amat == '' || body.email == '' || body.telf == '' || body.ci == '' || body.tipo == undefined) {
    //         console.log('1:', body)
    //         console.log('2:', file)
    //         req.flash('agregarPersona', 'Error: Todos los campos son necesarios.')
    //         res.redirect('/home/1');
    //     } else {
    //         if (body.tipo == 'Voluntario') {
    //             uploadPhoto(req, res, async (err) => {
    //                 console.log('3:', body.tipo)
    //                 console.log('4:', file)
    //                 if (err) {
    //                     req.flash('agregarPersona', 'Voluntario: Hubo un problema con el registro.')
    //                     res.redirect('/home/1');
    //                 } else {
    //                     if (body.registro == '' || body.rol == undefined || body.voluntario == undefined || file == undefined) {
    //                         req.flash('agregarPersona', 'Error: Todos los campos son necesarios.')
    //                         res.redirect('/home/1');
    //                     } else {
    //                         await JSON.stringify(pool.query('SELECT * FROM personas WHERE ci=$1', [body.ci], function (err, result) {
    //                             if (result.rows[0]) {
    //                                 req.flash('agregarPersona', 'Este usuario ya existe!')
    //                                 res.redirect('/home/1');
    //                             } else {
    //                                 req.flash('agregarPersona', 'Success')
    //                                 res.redirect('/home/1');
    //                             }
    //                         }));
    //                     }
    //                 }
    //             })
    //         }
    //         // if (req.body.tipo == 'Adulto') {
    //         //     uploadPhoto(req, res, async (err) => {
    //         //         if (err) {
    //         //             req.flash('agregarPersona', 'Adulto: Hubo un problema con el registro.')
    //         //             res.redirect('/home/1');
    //         //         } else {

    //         //         }
    //         //     })
    //         // }
    //     }
    //     // uploadPhoto(req, res, async (err) => {
    //     //     if (err) {
    //     //         // res.render('home', req.flash('agregarPersona', 'Error con la imagen'))
    //     //         req.flash('agregarPersona', 'Hubo un problema con el registro.')
    //     //         res.redirect('/home/1');
    //     //     }
    //     //     if (req.file == undefined || req.body.nombre == '' || req.body.apat == '' || req.body.amat == '' || req.body.email == '' || req.body.telf == '' || req.body.ci == '' || req.body.tipo == undefined) {
    //     //         console.log('1:', req.body, req.body.tipo)
    //     //         console.log('2:', req.file)
    //     //         req.flash('agregarPersona', 'Error: Todos los campos son necesarios.')
    //     //         res.redirect('/home/1');
    //     //     } else {
    //     //         const client = await pool.connect()
    //     //         await client.query('BEGIN')


    //     //         if (req.body.tipo == 'Voluntario') {
    //     //             //nombres, apat, amat, email, telf, ci
    //     //             console.log('asdasd', req.body);

    //     //             insertarPersonas(req.body.nombre, req.body.apat, req.body.amat, req.body.email, req.body.telf, req.body.ci)
    //     //             req.flash('agregarPersona', 'Voluntario.')
    //     //             res.redirect('/home/1');

    //     //             // await JSON.stringify(client.query(`insert into voluntarios (registro,idtipo,idpersona)
    //     //             // values(${req.body.registro},${req.body.voluntario},${req.body.amat},${req.body.email},${req.body.telf},${req.body.ci},'T'`))
    //     //         }
    //     //         if (req.body.tipo == 'Adulto') {
    //     //             req.flash('agregarPersona', 'Adulto.')
    //     //             res.redirect('/home/1');
    //     //         }
    //     //     }
    //     // })
    // } catch (error) {
    //     throw (error)
    // }
});

//----------------------------------------------
router.get('/logout', function (req, res) {

    console.log(req.isAuthenticated());
    req.logout();
    console.log(req.isAuthenticated());
    res.redirect('/');
});
//----------------------------------------------

module.exports = router