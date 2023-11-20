(function() {

    const lat = document.querySelector('#lat').value || -27.337934;
    const lng = document.querySelector('#lng').value || -55.8604682;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker;
    //utilizar providers y geocoders
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //el pin
    marker = new L.marker([lat, lng],{
        draggable:true,
        autoPan:true
    })
    .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend', function(e) {
        const movedMarker = e.target;  // Usar una variable diferente
        const posicion = movedMarker.getLatLng();
    
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
    
        // obtener el nombre de las calles
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {
            //console.log(resultado);
        // Cerrar el popup existente antes de asignar uno nuevo
        movedMarker.closePopup();

        // Agregar un popup con la información de la geocodificación inversa
        movedMarker.bindPopup(resultado.address.LongLabel).openPopup();

        //llenar los campos
        document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
        document.querySelector('#calle').value = resultado?.address?.Address ?? '';
        document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
        document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';

        })
    });

})();
