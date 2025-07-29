<?php
/**
 * Plugin Name: Marketing Blocks by Bertuuk
 * Plugin URI: https://github.com/bertuuk/marketing-blocks
 * Description: Custom Gutenberg blocks for marketing, including GetResponse forms.
 * Author: Berta Nicolau
 * Author URI: https://github.com/bertuuk
 * Version: 2.1.4
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: bertuuk-marketing-blocks
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function bmb_block_init() {
	register_block_type( __DIR__ . '/build/getresponse-form' );
}
add_action( 'init', 'bmb_block_init' );

function bmb_load_textdomain() {
    load_plugin_textdomain( 'bmb', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'bmb_load_textdomain' );

require_once plugin_dir_path( __FILE__ ) . 'includes/recaptcha-settings.php';

/**
 * Valida los campos del formulario y las trampas de usuario.
 *
 * @param WP_REST_Request $request Request object.
 * @return array Resultado de la validación.
 */
function validate_form_and_traps($request) {
    $honeypot = $request->get_param('user_comment');
    $start_time = $request->get_param('start_time');
    $current_time = time() * 1000;;
    $errors = [];

    if (!empty($honeypot)) {
        $errors[] = 'Se detectó actividad sospechosa.';
    }

    if (($current_time - $start_time) < 5000) {
        $errors[] = ' current: ' . $current_time . ' start: ' . $start_time . ' = ' . $current_time - $start_time . 'El formulario se completó demasiado rápido.';
    }

    // Validar el campo de email
    $email = $request->get_param('email');
    if (empty($email)) {
        $errors[] = 'No olvides llenar el campo e-mail.';
    }

    // Validar términos y condiciones
    $terms_and_conditions = $request->get_param('terms-and-conditions');
    if (empty($terms_and_conditions)) {
        $errors[] = 'Si no aceptas los términos y condiciones no podremos seguir en contacto.';
    }

    return $errors;
}
/**
 * Valida el token de reCAPTCHA.
 *
 * @param string $request Token de reCAPTCHA.
 * @return array Resultado de la validación de reCAPTCHA.
 */
function validate_recaptcha_token(WP_REST_Request $request) {
    $recaptcha_response = $request->get_param('token');
    $recaptcha_secret = get_option( 'bmb_recaptcha_secret_key' );
    if (empty($recaptcha_response)) {
        return new WP_REST_Response(['success' => false, 'reason' => 'Missing reCAPTCHA token.'], 400);
    }
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
    
    if ($response === false) {
        return ['success' => false, 'reason' => 'Failed to contact reCAPTCHA service.'];
    }

    $response_keys = json_decode($response, true);
    if (!$response_keys) {
        return ['success' => false, 'reason' => 'Invalid response from reCAPTCHA service.'];
    }

    if (!$response_keys['success']) {
        return ['success' => false, 'reason' => 'reCAPTCHA validation failed.', 'score' => $response_keys['score']];
    } elseif ($response_keys['score'] < 0.7) {
        return ['success' => false, 'reason' => 'Low reCAPTCHA score.', 'score' => $response_keys['score']];
    }

    return ['success' => true];
}

/**
 * Valida los campos del formulario y las trampas de usuario.
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response Response object.
 */
function validate_form_and_traps_request(WP_REST_Request $request) {
    $errors = validate_form_and_traps($request);
    if (!empty($errors)) {
        return new WP_REST_Response(['success' => false, 'reason' => implode(' ', $errors)], 200);
    }
    return new WP_REST_Response(['success' => true], 200);
}
/**
 * Registra las rutas de validación de campos/trampas y reCAPTCHA.
 */
function register_recaptcha_validation_endpoint() {
    register_rest_route('custom/v1', '/validate-fields-and-traps', array(
        'methods'  => 'POST',
        'callback' => 'validate_form_and_traps_request',
        'permission_callback' => '__return_true',
    ));
    register_rest_route('custom/v1', '/validate-recaptcha', array(
        'methods'  => 'POST',
        'callback' => 'validate_recaptcha_token',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'register_recaptcha_validation_endpoint');