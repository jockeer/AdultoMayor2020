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
        if (user.tipo == 'Adulto') {
            cb(null, `${user.nombre} ${user.apat} ${user.amat}-${user.telf}.jpg`)
        } else {
            if (user.nombre != '' || user.apat != '' || user.amat != '' || user.email != '' || user.telf != '' || user.ci != '') {
                // if (validarImagen) {
                cb(null, `${user.nombre} ${user.apat} ${user.amat}-${user.ci}.jpg`)
            } else {
                cb('Error en el formulario.')
            }
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
        case '5':
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
                rol: req.user.rol,
                user: datos,
                file: `../photos/${datos.nombres} ${datos.apat} ${datos.amat}-${datos.ci}.jpg`
            });
            console.log('home', req.user, datos)
        } else {
            res.redirect('/login');
        }
    }
});
//----------------------------------------------
router.post('/agregar', async function (req, res, next) {

    uploadPhoto(req, res, async (err) => {
        if (err) {
            // console.log(err);
            req.flash('agregarPersona', err)
            res.redirect('/home/1');
        } else {
            const body = req.body
            const file = req.file
            if (body.nombre == '' || body.apat == '' || body.amat == '' || body.telf == '' || body.tipo == undefined) {
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
                                                    await pool.query('insert into cuentas (usuario,pass,idpersona,rol) values($1,$2,$3,$4) returning *', [body.registro, body.ci, persona.idpersona, body.rol])
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
                    await pool.query('SELECT * FROM personas WHERE telf=$1', [body.telf], async function (err, result) {
                        if (result.rows[0]) {
                            req.flash('agregarPersona', 'Este usuario ya existe!')
                            res.redirect('/home/1');
                        } else {
                            await pool.query('insert into personas (nombres,apat,amat,email,telf,ci,estado) values($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                                [body.nombre, body.apat, body.amat, body.nombre + '@gmail.com', body.telf, body.telf, 'T'], async (err, resP) => {
                                    
                                    if (resP.rows[0]) {
                                        const persona = resP.rows[0]
                                        let foto= `${body.nombre} ${body.apat} ${body.amat}-${body.telf}`
                                        await pool.query('insert into adultos (idpersona,foto) values($1,$2) returning *', [persona.idpersona, foto])
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
});

//----------------------------------------------
router.get('/logout', function (req, res) {

    console.log(req.isAuthenticated());
    req.logout();
    console.log(req.isAuthenticated());
    res.redirect('/');
});
//----------------------------------------------
//-----------------API--------------------------
router.get('/api/getPersonas', async (req, res, next) => {
    let all = await pool.query('Select * from personas')
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})

router.get('/api/getPersonasNoAsignadas/:rol', async (req, res, next) => {
    var rol = req.params.rol
    let all = await pool.query(`select pe.idpersona,pe.nombres,pe.apat,pe.amat,pe.ci,cu.rol from personas pe inner join cuentas cu on(pe.idpersona=cu.idpersona) where cu.rol='${rol}' and pe.idpersona not in(select idpersona from asignacion)`)
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/getAdultosNoAsignados/:idlab/:idhorario', async (req, res, next) => {
    var idlab = req.params.idlab
    var idhorario = req.params.idhorario
    let all = await pool.query(`select pe.idpersona,adu.idadulto,pe.nombres,pe.apat,pe.amat,pe.ci,asig.idlab from personas pe inner join adultos adu on(pe.idpersona = adu.idpersona) inner join asignacion asig on(pe.idpersona = asig.idpersona) where asig.idlab = ${idlab} and asig.idhorario=${idhorario} and adu.idadulto not in(select idadulto from asignacionadulto)`)
    // console.log(json)
    res.json(all.rows)
})

router.get('/api/getVolNoAsignados/:idlab/:idhorario', async (req, res, next) => {
    var idlab = req.params.idlab
    var idhorario = req.params.idhorario
    let all = await pool.query(`select pe.idpersona,vol.registro,pe.nombres,pe.apat,pe.amat,pe.ci,asig.idlab from personas pe inner join voluntarios vol on(pe.idpersona = vol.idpersona) inner join asignacion asig on(pe.idpersona = asig.idpersona) where asig.idlab = ${idlab} and asig.idhorario=${idhorario} and vol.registro not in(select registro from asignacionadulto)`)
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/getFacilitadores/:idlab/:idhorario', async (req, res, next) => {
    var idlab = req.params.idlab
    var idhorario = req.params.idhorario
    let all = await pool.query(`select pe.nombres,pe.apat,pe.amat,pe.ci,vol.registro,cu.rol,asig.idlab,asig.idhorario from personas pe inner join voluntarios vol on(pe.idpersona=vol.idpersona)inner join cuentas cu on(cu.idpersona=pe.idpersona) inner join asignacion asig on(asig.idpersona=pe.idpersona) where cu.rol = 'Co-Facilitador' or cu.rol = 'Facilitador' and asig.idlab=${idlab} and asig.idhorario=${idhorario}`)
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/getVoluntarios/:idlab/:idhorario', async (req, res, next) => {
    var idlab = req.params.idlab
    var idhorario = req.params.idhorario
    let all = await pool.query(`select personas.nombres,personas.apat,personas.amat,personas.ci,asignacion.idasig,voluntarios.registro,asignacionadulto.registro,adultos.foto,adultos.idadulto 
    from personas,asignacion,voluntarios,asignacionadulto,adultos
    where personas.idpersona=asignacion.idpersona and personas.idpersona = voluntarios.idpersona 
    and voluntarios.registro=asignacionadulto.registro and adultos.idadulto=asignacionadulto.idadulto 
    and asignacion.idlab = ${idlab} and asignacion.idhorario=${idhorario}`)
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/obtenerAsisMarcada/:fecha/:registro', async (req, res, next) => {
    var fecha = req.params.fecha
    var registro = req.params.registro
    let all = await pool.query(`select * from asistencia_voluntario where fecha='${fecha}' and registro='${registro}'`)
    // console.log(json)
    res.json(all.rows)
})


router.post('/api/asignarLab', async (req, res, next) => {
    // var id = req.params.id
    var body = req.body
    console.log(body)
    let all = await pool.query(`insert into asignacion(fec_ini,fec_fin,idlab,idpersona,idhorario)values('${body.fec_ini}','${body.fec_fin}',${body.idlab},${body.idpersona},${body.idhorario})`)
    // console.log(json)
    res.json(all.rows)
    // res.redirect('/home/3')
})
router.post('/api/asignarAdulto', async (req, res, next) => {
    // var id = req.params.id
    var body = req.body
    console.log(body)
    let all = await pool.query(`insert into asignacionadulto(registro,idadulto)values('${body.registro}',${body.idadulto})`)
    // console.log(json)
    res.json(all.rows)
    // res.redirect('/home/3')
})
router.post('/api/regIngresoVol', async (req, res, next) => {
    // var id = req.params.id
    var body = req.body
    console.log(body)
    let all = await pool.query(`insert into asistencia_voluntario(fecha,hora_ing,hora_salida,registro)values('${body.fecha}','${body.hora_ing}','${body.hora_salida}','${body.registro}')`)
    // console.log(json)
    res.json(all.rows)
    // res.redirect('/home/3')
})
router.put('/api/regSalidaVol/:fecha/:registro', async (req, res, next) => {
    var fecha = req.params.fecha
    var registro = req.params.registro
    var body = req.body
    console.log(body)
    let all = await pool.query(`UPDATE asistencia_voluntario set hora_salida='${body.hora_salida}' where fecha='${fecha}' and registro= '${registro}'`)
    // console.log(json)
    res.json(all.rows)
    // res.redirect('/home/3')
})




module.exports = router