import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const {email, nombre, token} = datos
        //enviar el email
        await transport.sendMail({
            from: 'AlertaRuido.com',
            to: email,
            subject: 'Confirma tu cuenta en AlertaRuido.com',
            text: 'Confirma tu cuenta en AlertaRuido.com',
            html: `
                <p>Hola ${nombre}, comprueba tu cuenta en AlertaRuido.com</p>

                <p>Tu cuenta ya esta lista solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

                <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
            `
        })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const {email, nombre, token} = datos
    //enviar el email
    await transport.sendMail({
        from: 'AlertaRuido.com',
        to: email,
        subject: 'Reestablece tu contraseña en AlertaRuido.com',
        text: 'Reestablece tu contraseña en AlertaRuido.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en AlertaRuido.com</p>

            <p>Sigue el siguiente enlace para generar tu nueva contraseña:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT || 3000}/auth/olvide-password/${token}">Reestablecer Contraseña</a></p>

            <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
        `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}