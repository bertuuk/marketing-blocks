<?php
/**
 * Plugin Name:       La tarambana Blocks
 * Description:       Guttenberg blocks for Tarambana Theme
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.3.0
 * Author:            Berta
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       latarambana-blocks
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
function latarambana_blocks_latarambana_blocks_block_init() {
	register_block_type( __DIR__ . '/build/block-2' );
	register_block_type( __DIR__ . '/build/getresponse-form' );
}
add_action( 'init', 'latarambana_blocks_latarambana_blocks_block_init' );
