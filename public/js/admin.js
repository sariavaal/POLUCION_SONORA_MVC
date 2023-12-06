/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/admin.js":
/*!*************************!*\
  !*** ./src/js/admin.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n\r\n    const lat = document.querySelector('#lat').value || -27.337934;\r\n    const lng = document.querySelector('#lng').value || -55.8604682;\r\n    const mapa = L.map('mapa').setView([lat, lng ], 20);\r\n    let marker;\r\n    //utilizar providers y geocoders\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n    \r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    //el pin\r\n    marker = new L.marker([lat, lng],{\r\n        draggable:false,\r\n        autoPan:true\r\n    })\r\n    .addTo(mapa)\r\n\r\n    //Detectar el movimiento del pin\r\n    marker.on('moveend', function(e) {\r\n        const movedMarker = e.target;  // Usar una variable diferente\r\n        const posicion = movedMarker.getLatLng();\r\n    \r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))\r\n    \r\n        // obtener el nombre de las calles\r\n        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {\r\n            //console.log(resultado);\r\n        // Cerrar el popup existente antes de asignar uno nuevo\r\n        movedMarker.closePopup();\r\n\r\n        // Agregar un popup con la información de la geocodificación inversa\r\n        movedMarker.bindPopup(resultado.address.LongLabel).openPopup();\r\n\r\n        //llenar los campos\r\n        document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';\r\n        document.querySelector('#calle').value = resultado?.address?.Address ?? '';\r\n        document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';\r\n        document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';\r\n\r\n        })\r\n    });\r\n\r\n})();\r\n\n\n//# sourceURL=webpack://polucion_sonora_mvc/./src/js/admin.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/admin.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;