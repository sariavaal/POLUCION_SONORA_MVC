import path from 'path'
export default{
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        agregarImagen:'./src/js/agregarImagen.js',
        admin: './src/js/admin.js',
        eliminarUsuario: './src/js/eliminarUsuario.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}