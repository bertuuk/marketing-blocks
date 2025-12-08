/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/getresponse-form/view.js ***!
  \**************************************/
// Función para obtener los mensajes traducidos
function getTranslatedMessages() {
  const lang = document.documentElement.lang;
  const messages = {
    es: {
      emailRequired: 'No olvides rellenar el campo e-mail.',
      termsRequired: 'Si no aceptas los términos y condiciones no podremos seguir en contacto.',
      suspiciousActivity: 'Se ha detectado actividad sospechosa. Inténtalo de nuevo.',
      formTooFast: 'Error. Espera unos segundos y vuelve a enviar el formulario.',
      recaptchaError: 'Error al validar el reCAPTCHA. Por favor, inténtalo de nuevo.',
      validationError: 'Error al procesar la suscripción. Inténtalo más tarde.',
      serverError: 'Error de conexión con el servidor.'
    },
    ca: {
      emailRequired: 'No oblidis omplir el camp e-mail.',
      termsRequired: 'Si no acceptes els termes i condicions no podrem seguir en contacte.',
      suspiciousActivity: 'S\'ha detectat activitat sospitosa. Torna-ho a intentar.',
      formTooFast: 'Error. Espera uns segons i torna a enviar el formulari.',
      recaptchaError: 'Error en validar el reCAPTCHA. Si us plau, torneu-ho a intentar.',
      validationError: 'Error en processar la subscripció. Prova-ho més tard.',
      serverError: 'Error de connexió amb el servidor.'
    }
  };
  return messages[lang] || messages['es'];
}
const messages = getTranslatedMessages();
function validateFormFields(form) {
  const emailField = form.querySelector('input[name="email"]');
  const termsField = form.querySelector('input[name="terms-and-conditions"]');
  let errors = [];
  if (!emailField || !emailField.value.trim()) {
    errors.push(messages.emailRequired);
  }
  if (!termsField || !termsField.checked) {
    errors.push(messages.termsRequired);
  }
  return errors;
}
function validateUserTraps(form) {
  const honeypot = form.querySelector('input[name="user_comment"]').value;
  const startTime = parseInt(form.querySelector('input[name="start_time"]').value, 10);
  const currentTime = Date.now();
  let errors = [];
  if (honeypot) {
    errors.push(messages.suspiciousActivity);
  }
  if (currentTime - startTime < 5000) {
    errors.push(messages.formTooFast);
  }
  return errors;
}

/**
 * NOVA FUNCIÓ: Envia tot al servidor d'una sola vegada
 * El servidor validarà i enviarà a GetResponse
 */
async function processSubscriptionOnServer(formDataJSON) {
  try {
    // Assegura't que la ruta coincideix amb la que has definit al PHP
    const response = await fetch('/wp-json/custom/v1/process-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Si en el futur implementes nonce, aniria aquí: 'X-WP-Nonce': miVariableNonce
      },
      body: JSON.stringify(formDataJSON)
    });
    if (!response.ok) {
      throw new Error('Error HTTP: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      reason: messages.serverError
    };
  }
}
function showError(message, form) {
  let errorRegion = form.querySelector('.form-error-region');
  if (!errorRegion) {
    console.warn('No error region defined in form for accessibility.');
    return;
  }
  let errorDiv = errorRegion.querySelector('.form-error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorRegion.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
  form.querySelectorAll('input').forEach(input => {
    input.classList.add('error');
  });
}
function clearError(form) {
  let errorRegion = form.querySelector('.form-error-region');
  if (!errorRegion) {
    return;
  }
  let errorDiv = errorRegion.querySelector('.form-error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
  form.querySelectorAll('input').forEach(input => {
    input.classList.remove('error');
  });
}
document.querySelectorAll('.g-recaptcha').forEach(button => {
  button.addEventListener('click', function (event) {
    event.preventDefault();
    const activeSubmitButton = this;
    const sitekey = activeSubmitButton.getAttribute('data-sitekey');
    const uniqueId = activeSubmitButton.getAttribute('data-id');
    const form = document.getElementById(uniqueId);
    let errors = [];

    // Validar camps client-side
    errors = errors.concat(validateFormFields(form));
    if (errors.length > 0) {
      showError(errors.join('\n'), form);
      return;
    }

    // Validar trampes client-side (per estalviar peticions si és obvi)
    errors = errors.concat(validateUserTraps(form));
    if (errors.length > 0) {
      showError(errors.join(' '), form);
      return;
    }
    clearError(form);

    // Executar reCAPTCHA i cridar a onSubmit
    grecaptcha.execute(sitekey, {
      action: 'submit'
    }).then(function (token) {
      window.onSubmit(token, activeSubmitButton);
    });
  });
});
window.onSubmit = function (token, activeSubmitButton, event) {
  if (activeSubmitButton) {
    const uniqueId = activeSubmitButton.getAttribute('data-id');
    const form = document.getElementById(uniqueId);
    if (form) {
      // Lògica de l'URL de seguiment
      const pageName = window.location.pathname;
      const pageNameInput = form.querySelector('input[name="custom_url_seguimiento"]');
      if (pageNameInput) {
        if (pageNameInput.value.includes('http')) {
          showError(messages.suspiciousActivity, form);
          return;
        } else {
          pageNameInput.value = pageName;
        }
      }

      // Validacions finals abans d'enviar
      const errors = validateFormFields(form).concat(validateUserTraps(form));
      if (errors.length > 0) {
        showError(errors.join(' \n'), form);
        return;
      }

      // Preparem les dades
      const formData = new FormData(form);
      const formDataJSON = {};
      formData.forEach((value, key) => {
        formDataJSON[key] = value;
      });
      // Afegim el token manualment al JSON
      formDataJSON['token'] = token;

      // Deshabilitem el botó per evitar doble click
      activeSubmitButton.disabled = true;
      activeSubmitButton.value = "Enviant..."; // O "Sending..."

      // --- CANVI PRINCIPAL AQUÍ ---
      // Cridem a la nova funció única
      processSubscriptionOnServer(formDataJSON).then(response => {
        if (response.success) {
          // SI ÉS CORRECTE: Redirecció manual
          if (response.redirect_url) {
            window.location.href = response.redirect_url;
          } else {
            // Fallback si no hi ha URL de gràcies definida
            alert('Gràcies! Subscripció realitzada.');
            form.reset();
          }
        } else {
          // SI HI HA ERROR: Mostrem l'error que ve del PHP
          activeSubmitButton.disabled = false;
          activeSubmitButton.value = activeSubmitButton.getAttribute('value') || 'Enviar'; // Restaurar text
          showError(response.reason || messages.validationError, form);
        }
      }).catch(() => {
        activeSubmitButton.disabled = false;
        showError(messages.validationError, form);
      });
    }
  }
};
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.lead-mail-form').forEach(form => {
    const startTimeField = form.querySelector('input[name="start_time"]');
    if (startTimeField) {
      startTimeField.value = Date.now();
    }
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map