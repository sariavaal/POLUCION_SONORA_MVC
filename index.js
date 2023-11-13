import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

//crear la app
const app = express()
//habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))

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

//Definir un puerto y conecta la aplicacion
const port= process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)

});