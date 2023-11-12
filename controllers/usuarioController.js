import {check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

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
    //console.log(req.body)
    //validacion de los otros campos
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('telefono').notEmpty().withMessage('El número de teléfono es obligatorio').isNumeric().withMessage('El número de teléfono es un valor inválido').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('La contraseña no coincide').run(req)
     // Validar el checkbox
     const validacionCheckbox = await check('miCheckbox').isIn(['on']).withMessage('Debes aceptar los términos y condiciones de uso').run(req);
     //console.log('Después de las validaciones:', req.body);
    let resultado = validationResult(req)
    //const errors = validationResult(req);
    //console.log('Errores de validación:', errors.array());
    //verificar que el resultado este vacio
    if(!resultado.isEmpty() || !validacionCheckbox.isEmpty()) {
        //errores
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores: [...resultado.array(), ...validacionCheckbox.array()],
            usuario: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                telefono: req.body.telefono,
            },
            VerificarCheckbox: req.body.miCheckbox === 'on',
        })

    }
    //extraer los datos
    const {nombre, apellido, email,telefono, password, VerificarCheckbox} = req.body
    // Verificar que el checkbox "confirmado" esté marcado
    if (!VerificarCheckbox) {
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
    await Usuario.create({
        nombre,
        apellido,
        email,
        telefono,
        password,
        token: 123
    }) 
}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Alerta Ruido'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}