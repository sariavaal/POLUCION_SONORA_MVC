console.log('DOMContentLoaded evento se ha ejecutado');

const botones = document.querySelectorAll('.eliminarUsuarioBtn');
botones.forEach((boton) => {
    boton.addEventListener('click', (e) => {
        // Aquí puedes agregar la lógica que se ejecutará cuando se haga clic en el botón
        console.log('Se hizo clic en un botón eliminarUsuarioBtn');
        e.preventDefault();
        console.log('Estoy en el script');

        const id = e.currentTarget.getAttribute('data-id');
        console.log(e.currentTarget, id);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: `eliminar-usuario/${id}`,
            type: 'DELETE',
            success: function (data) {
                console.log(data);
                location.reload();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error al eliminar usuario', textStatus, errorThrown);
                //alert('Error al eliminar usuario');
            }
        });
    });
});

