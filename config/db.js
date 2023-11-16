import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path:'.env'})

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER,process.env.DB_PASSWORD ?? '' , {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000, //30segundos antes de tirar error
        idle: 10000 //10 segundos para finalizar la conexion para liberar memoria
    },
    //operatorsAliases: true,
});
console.log('Configuración de Sequelize:', db.config);


export default db