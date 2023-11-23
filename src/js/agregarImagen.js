import {Dropzone} from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//console.log(token)

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube las imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFileSize: 5,
    maxFiles: 5,
    parallelUploads: 5,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El limite de carga es de 5 archivos',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function() {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function (){
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis-reportes'
            }
        })

    }

}



