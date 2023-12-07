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

/***/ "./src/js/eliminarUsuario.js":
/*!***********************************!*\
  !*** ./src/js/eliminarUsuario.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconsole.log('DOMContentLoaded evento se ha ejecutado');\r\n\r\nconst botones = document.querySelectorAll('.eliminarUsuarioBtn');\r\nbotones.forEach((boton) => {\r\n    boton.addEventListener('click', (e) => {\r\n        // Aquí puedes agregar la lógica que se ejecutará cuando se haga clic en el botón\r\n        console.log('Se hizo clic en un botón eliminarUsuarioBtn');\r\n        e.preventDefault();\r\n        console.log('Estoy en el script');\r\n\r\n        const id = e.currentTarget.getAttribute('data-id');\r\n        console.log(e.currentTarget, id);\r\n        $.ajaxSetup({\r\n            headers: {\r\n                'X-CSRF-TOKEN': $('meta[name=\"csrf-token\"]').attr('content')\r\n            }\r\n        });\r\n        $.ajax({\r\n            url: `eliminar-usuario/${id}`,\r\n            type: 'DELETE',\r\n            success: function (data) {\r\n                console.log(data);\r\n                location.reload();\r\n            },\r\n            error: function (jqXHR, textStatus, errorThrown) {\r\n                console.error('Error al eliminar usuario', textStatus, errorThrown);\r\n                //alert('Error al eliminar usuario');\r\n            }\r\n        });\r\n    });\r\n});\r\n\r\n\n\n//# sourceURL=webpack://polucion_sonora_mvc/./src/js/eliminarUsuario.js?");

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
/******/ 	__webpack_modules__["./src/js/eliminarUsuario.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;