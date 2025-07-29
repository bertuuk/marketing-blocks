<?php
// Afegeix una pàgina al menú d'opcions
add_action( 'admin_menu', 'bmb_add_settings_page' );
function bmb_add_settings_page() {
    add_options_page(
        'Configuració Marketing Blocks',
        'Marketing Blocks',
        'manage_options',
        'bmb-settings',
        'bmb_render_settings_page'
    );
}

// Registra la configuració i el camp
add_action( 'admin_init', 'bmb_register_settings' );
function bmb_register_settings() {
    register_setting( 'bmb_settings_group', 'bmb_recaptcha_site_key' );

    add_settings_section(
        'bmb_main_section',
        'Configuració general',
        null,
        'bmb-settings'
    );

    add_settings_field(
        'bmb_recaptcha_site_key',
        'Clau pública de reCAPTCHA',
        'bmb_render_site_key_field',
        'bmb-settings',
        'bmb_main_section'
    );
}

// Camp de text
function bmb_render_site_key_field() {
    $value = esc_attr( get_option( 'bmb_recaptcha_site_key', '' ) );
    echo '<input type="text" name="bmb_recaptcha_site_key" value="' . $value . '" size="40">';
}

// Renderitza la pàgina
function bmb_render_settings_page() {
    ?>
    <div class="wrap">
        <h1>Configuració del Plugin Bertuuk</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields( 'bmb_settings_group' );
            do_settings_sections( 'bmb-settings' );
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
