<?php
/**
 * Plugin Name: Marketing Blocks by Bertuuk
 * Plugin URI: https://github.com/bertuuk/marketing-blocks
 * Description: Custom Gutenberg blocks for marketing, including GetResponse forms.
 * Author: Berta Nicolau
 * Author URI: https://github.com/bertuuk
 * Version: 2.0.0
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
function littledaisy_blocks_littledaisy_blocks_block_init() {
	register_block_type( __DIR__ . '/build/getresponse-form' );
}
add_action( 'init', 'littledaisy_blocks_littledaisy_blocks_block_init' );

function littledaisy_blocks_load_textdomain() {
    load_plugin_textdomain( 'littledaisy-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'littledaisy_blocks_load_textdomain' );
