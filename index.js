import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import reporteRoutes from './routes/reporteRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import db from './config/db.js'



//crear la app- usos globales
const app = express()
app.use(express.urlencoded({extended: true}))
//Habilitar cookie-parser
app.use( cookieParser() )

app.use(express.json());

//Habilitar CSRF
app.use ( csrf({cookie: true}))

//conexion a la base de datos
try{
    await db.authenticate();
    db.sync()
    console.log('conexion correcta a la bd')

}catch(error){
    console.log(error)

}

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')
//carpeta publica
app.use(express.static('public'))

//routing
app.use('/auth', usuarioRoutes)
app.use('/', reporteRoutes)
app.use ('/reportes/admin', adminRoutes)

//Definir un puerto y conecta la aplicacion
const port= process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)

});