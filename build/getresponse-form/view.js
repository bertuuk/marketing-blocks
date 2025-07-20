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
      validationError: 'Error al validar el envio del formulario'
    },
    ca: {
      emailRequired: 'No oblidis omplir el camp e-mail.',
      termsRequired: 'Si no acceptes els termes i condicions no podrem seguir en contacte.',
      suspiciousActivity: 'S\'ha detectat activitat sospitosa. Torna-ho a intentar.',
      formTooFast: 'Error. Espera uns segons i torna a enviar el formulari.',
      recaptchaError: 'Error en validar el reCAPTCHA. Si us plau, torneu-ho a intentar.',
      validationError: 'Error en validar l\'enviament del formulari'
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
async function validateFieldsAndTrapsOnServer(formData) {
  try {
    const response = await fetch('/wp-json/custom/v1/validate-fields-and-traps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    const data = await response.json();
    return data; // Devolver los datos completos de la respuesta
  } catch (error) {
    return {
      success: false,
      reason: messages.validationError
    };
  }
}
async function validateRecaptchaOnServer(token) {
  try {
    const response = await fetch('/wp-json/custom/v1/validate-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token
      })
    });
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    const data = await response.json();
    return data; // Devolver los datos completos de la respuesta
  } catch (error) {
    return {
      success: false,
      reason: messages.recaptchaError
    };
  }
}
function showError(message, form) {
  let errorRegion = form.querySelector('.form-error-region');
  if (!errorRegion) {
    console.warn('No error region defined in form for accessibility.');
    return;
  }
  // Crear un div para mostrar el mensaje de error
  let errorDiv = errorRegion.querySelector('.form-error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorRegion.appendChild(errorDiv);
  }
  errorDiv.textContent = message;

  // Agregar clase de error a los campos relevantes
  form.querySelectorAll('input').forEach(input => {
    input.classList.add('error');
  });
}
function clearError(form) {
  let errorRegion = form.querySelector('.form-error-region');
  if (!errorRegion) {
    console.warn('No error region defined in form for accessibility.');
    return;
  }
  // Borrar el div con el mensaje de error si existe
  let errorDiv = errorRegion.querySelector('.form-error-message');
  if (errorDiv) {
    errorDiv.remove();
  }

  // Remover clase de error de los campos relevantes
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

    // Inicializar errores
    let errors = [];

    // Validar los campos del formulario
    errors = errors.concat(validateFormFields(form));
    if (errors.length > 0) {
      showError(errors.join('\n'), form);
      return;
    }

    // Validar las trampas de usuario
    errors = errors.concat(validateUserTraps(form));
    if (errors.length > 0) {
      showError(errors.join(' '), form);
      return;
    }
    clearError(form); // Borrar mensajes de error anteriores
    // Si todas las validaciones anteriores pasan, ejecutar reCAPTCHA
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
      const pageName = window.location.pathname;
      // Asignar el nombre de la página al campo oculto
      const pageNameInput = form.querySelector('input[name="custom_url_seguimiento"]');
      if (pageNameInput) {
        if (pageNameInput.value.includes('http')) {
          showError(messages.suspiciousActivity, form);
          return;
        } else {
          pageNameInput.value = pageName; // Actualizamos el valor
        }
      }
      // Validar campos del formulario y trampas
      const errors = validateFormFields(form).concat(validateUserTraps(form));
      if (errors.length > 0) {
        showError(errors.join(' \n'), form);
        return; // Evitar que se continúe si hay errores
      }
      const formData = new FormData(form);
      formData.append('token', token);

      // Convertir FormData a JSON
      const formDataJSON = {};
      formData.forEach((value, key) => {
        formDataJSON[key] = value;
      });
      validateFieldsAndTrapsOnServer(formDataJSON).then(response => {
        if (response.success) {
          validateRecaptchaOnServer(token).then(response => {
            if (response.success) {
              form.submit();
            } else {
              showError(response.reason, form);
            }
          }).catch(() => {
            showError(recaptchaError, form);
          });
        } else {
          showError(messages.validationError, form);
        }
      }).catch(() => {
        showError(messages.validationError, form);
      });

      // Valida el token de reCAPTCHA en el servidor
    }
  }
};
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.lead-mail-form').forEach(form => {
    const startTimeField = form.querySelector('input[name="start_time"]');
    if (startTimeField) {
      startTimeField.value = Date.now(); // Establecer tiempo en milisegundos
    }
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map