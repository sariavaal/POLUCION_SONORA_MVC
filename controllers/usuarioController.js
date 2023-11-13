import {check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import {generarId} from '../helpers/tokens.js'
import{emailRegistro} from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

const formularioRegistro = (req, res) =>{
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) => {
    // Validar los campos
    await Promise.all([
        check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req),
        check('apellido').notEmpty().withMessage('El apellido es obligatorio').run(req),
        check('email').isEmail().withMessage('Eso no parece un email').run(req),
        check('telefono').notEmpty().withMessage('El número de teléfono es obligatorio').isNumeric().withMessage('El número de teléfono es un valor inválido').run(req),
        check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req),
        check('repetir_password').equals(req.body.password).withMessage('La contraseña no coincide').run(req),
    ]);

    // Validar el checkbox
    await check('miCheckbox').notEmpty().withMessage('Debes aceptar los términos y condiciones de uso').run(req);
    // Obtener los resultados de la validación
const errores = validationResult(req);
// Verificar si hay errores de validación
if (!errores.isEmpty()) {
    // Renderizar la vista con errores
    return res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        errores: errores.array(),
        usuario: {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            telefono: req.body.telefono,
        },
        VerificarCheckbox: req.body.miCheckbox === 'on',
    });
}

// Extraer los datos
const { nombre, apellido, email, telefono, password } = req.body;

// Verificar el checkbox
if (req.body.miCheckbox !== 'on') {
    return res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        errores: [{ msg: 'Debes aceptar los términos y condiciones de uso' }],
        usuario: {
            nombre,
            apellido,
            email,
            telefono,
        },
    });
}
    //verificar que el email no este duplicado
    const existeUsuario = await Usuario.findOne( { where:{ email} })
    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                telefono: req.body.telefono,
            }
        })
    }
    //almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        apellido,
        email,
        telefono,
        password,
        token: generarId()
    }) 

    //Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina:'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'

    })
}
//Función que comprueba una cuenta
const confirmar = (req, res, next) => {
    const { token } = req.params;
    console.log ( token )
    //verificar si el token es valido

    //Confirmar la cuenta

    next();
    

}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Alerta Ruido'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    confirmar,
    formularioOlvidePassword,
    registrar
}