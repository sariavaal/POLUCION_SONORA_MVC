import {check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
import {generarId} from '../helpers/tokens.js'
import{emailRegistro, emailOlvidePassword} from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}
const autenticar = async (req,res) => {
    //validar campos
    await check('email').isEmail().withMessage('El email es obligatorio').run(req),
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

    const errores = validationResult(req);
// Verificar si hay errores de validación
if (!errores.isEmpty()) {
    // Renderizar la vista con errores
    return res.render('auth/login', {
        pagina: 'Iniciar sesión',
        csrfToken : req.csrfToken(),
        errores: errores.array()
    });
}
const {email, password} = req.body
    //comprobar si el usuario existe
    const usuario = await  Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        });

    }
    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        });

    }
    //Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'La contraseña es incorrecta'}]
        });

    }
    //Autenticar al usuario
    const token = jwt.sign({
        nombre: 'Dinora',
        empresa: 'nada',
        tecnologias: 'node.js'
    }, "palabrasecreta", {
        expiresIn: '1d'
    })

}



const formularioRegistro = (req, res) =>{
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken : req.csrfToken()
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
        csrfToken : req.csrfToken(),
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
        //csrfToken : req.csrfToken(),
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
            csrfToken : req.csrfToken(),
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
const confirmar = async (req, res) => {
    const { token } = req.params;
    //console.log(token)
    //verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario){
      return res.render('auth/confirmar-cuenta', {
        pagina:'Error al confirmar tu cuenta',
        mensaje:'Hubo un error al confirmar tu cuenta, intenta de nuevo',
        error: true
      })
    }
    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina:'Cuenta confirmada',
        mensaje:'La cuenta se confirmó correctamente'
      })
}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Alerta Ruido',
        csrfToken : req.csrfToken(),
        
    })
}

const resetPassword = async (req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)

    let resultado = validationResult(req)
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //errores
        return res.render('auth/olvide-password',{
        pagina:'Recupera tu acceso a Alerta Ruido',
        csrfToken : req.csrfToken(), 
        errores: resultado.array()   
        })
    }
    //En caso de que si sea un email, y el ususario existe buscar al usuario
    const{email} = req.body
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso en Alerta Ruido',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no existe'}]
        })
    }
    //Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();
    //Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina:'Reestablecer Contraseña',
        mensaje: 'Hemos enviado un email con las instrucciones'

    })
}
const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina:'Reestablece tu contraseña',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true

        })
    }
    //Mostrat formulario para modificar el password
    res.render('auth/reset-password',{
        pagina: 'Reestablece tu contraseña',
        csrfToken: req.csrfToken()
    })
} 

const nuevoPassword = async (req, res) => {
    //Validar el password
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
    const errores = validationResult(req);
// Verificar si hay errores de validación
if (!errores.isEmpty()) {
    // Renderizar la vista con errores
    return res.render('auth/reset-password', {
        pagina: 'Reestablece tu contraseña',
        csrfToken : req.csrfToken(),
        errores: errores.array()
    });
}
    const { token } = req.params
    const { password } = req.body;
    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})

    //hashear password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt );
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina:'Contraseña reestablecida',
        mensaje: 'La contraseña se actualizó correctamente'
    })


    
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro, 
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
   
}