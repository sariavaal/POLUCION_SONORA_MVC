import Sequelize from 'sequelize'

const db = new Sequelize('polucionsonora_mvc', 'root', '',{
    host: 'Localhost',
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
    operatorAliases: false
});

export default db