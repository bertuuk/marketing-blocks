/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
/* eslint-enable no-console */
// Almacenar el botón activo en una variable global o en un contexto adecuado
let activeSubmitButton = null;


document.querySelectorAll('.g-recaptcha').forEach(button => {
    button.addEventListener('click', function (event) {
        // Previene el envío del formulario por defecto
        event.preventDefault();

        // Almacena el botón que se hizo clic
        activeSubmitButton = this;

        // Ejecuta reCAPTCHA
        grecaptcha.execute();
    });
});

window.onSubmit = function (token) {
    if (activeSubmitButton) {
        var uniqueId = activeSubmitButton.getAttribute('data-id');
        var form = document.getElementById(uniqueId);
        if (form) {
            // Agrega el token de reCAPTCHA al formulario
            var recaptchaResponse = document.createElement('input');
            recaptchaResponse.setAttribute('type', 'hidden');
            recaptchaResponse.setAttribute('name', 'recaptcha_response');
            recaptchaResponse.setAttribute('value', token);
            form.appendChild(recaptchaResponse);

            // Envía el formulario
            form.submit();
        }
    }
};