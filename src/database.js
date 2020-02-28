const {
    Pool
} = require('pg')


const connectionString = 'postgresql://postgres:posgres@localhost:5432/New-Adulto'


const pool = new Pool({
    connectionString: connectionString,
})

// async function testBuscarPersona(ci) {
//     await JSON.stringify(pool.query('SELECT * FROM personas WHERE ci=$1', [ci], function (err, result) {
//         if (result.rows[0]) {
//             const row = result.rows[0]
//             return row
//         } else {
//             return err
//         }
//     }));
// }

const Cnx = async () => {
    try {
        const bd = await pool.query('select current_database()')
        console.log(bd.rows, 'is connected')
    } catch (error) {
        console.log('Error en la conexion con la base de datos')
    }
}


//

// testBuscarPersona('9818626')

Cnx()

module.exports = pool