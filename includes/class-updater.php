<?php
/**
 * GitHub Releases updater for Bertuuk plugins.
 *
 * Lets WordPress update the plugin from the GitHub Releases of its repository
 * using the core "Update URI" mechanism (WordPress 5.8+). No third-party code.
 *
 * This file is identical in every plugin that uses it. To add it to a plugin:
 *
 * 1. Copy this file to includes/class-updater.php.
 * 2. Add the header to the main plugin file:
 *        Update URI: https://github.com/<owner>/<repo>
 * 3. Load it from the main plugin file:
 *        require_once __DIR__ . '/includes/class-updater.php';
 *        new Bertuuk_GitHub_Updater( __FILE__, '<owner>/<repo>' );
 *
 * Each GitHub Release must be marked as "latest" (not a pre-release or draft)
 * and carry an asset named exactly <plugin-folder>.zip, whose root folder is
 * <plugin-folder>/.
 *
 * If you change this file, copy the new version to every plugin: when two
 * plugins ship different copies, the first one WordPress loads is used.
 *
 * @package Bertuuk
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Bertuuk_GitHub_Updater' ) ) {

	/**
	 * Checks GitHub for new releases and feeds them to the WordPress updater.
	 */
	class Bertuuk_GitHub_Updater {

		/**
		 * How long a successful answer from GitHub is cached (12 hours).
		 */
		const CACHE_TTL = 43200;

		/**
		 * How long a failed answer is cached, so a GitHub outage or the
		 * anonymous API rate limit is not hit on every page load (1 hour).
		 */
		const ERROR_TTL = 3600;

		/**
		 * Plugin basename, e.g. "my-plugin/my-plugin.php".
		 *
		 * @var string
		 */
		private $plugin_file;

		/**
		 * Plugin folder name, also the name of the release asset (without .zip).
		 *
		 * @var string
		 */
		private $slug;

		/**
		 * GitHub repository, "owner/repo".
		 *
		 * @var string
		 */
		private $repo;

		/**
		 * Transient name for the cached release.
		 *
		 * @var string
		 */
		private $cache_key;

		/**
		 * Release already looked up during this request.
		 *
		 * @var array|null|false False when not looked up yet.
		 */
		private $release = false;

		/**
		 * @param string $file Full path of the main plugin file (__FILE__).
		 * @param string $repo GitHub repository, "owner/repo".
		 */
		public function __construct( $file, $repo ) {
			$this->plugin_file = plugin_basename( $file );
			$this->slug        = dirname( $this->plugin_file );
			$this->repo        = trim( $repo, '/' );
			$this->cache_key   = 'bertuuk_updater_' . md5( $this->repo );

			add_filter( 'update_plugins_github.com', array( $this, 'check_update' ), 10, 3 );
			add_filter( 'plugins_api', array( $this, 'plugin_info' ), 20, 3 );
		}

		/**
		 * Tells WordPress which version is available on GitHub.
		 *
		 * WordPress compares the returned version with the installed one: if it
		 * is newer, the update notice appears; if not, the plugin is listed as
		 * up to date, which is what shows the "Enable auto-updates" link.
		 *
		 * @param array|false $update      Update data from another filter, or false.
		 * @param array       $plugin_data Plugin headers.
		 * @param string      $plugin_file Plugin basename.
		 * @return array|false
		 */
		public function check_update( $update, $plugin_data, $plugin_file ) {
			if ( $plugin_file !== $this->plugin_file ) {
				return $update;
			}

			$release = $this->get_release();
			if ( ! $release ) {
				return $update;
			}

			return array(
				'slug'    => $this->slug,
				'version' => $release['version'],
				'package' => $release['package'],
				'url'     => $release['url'],
			);
		}

		/**
		 * Fills the "View details" window with the release notes.
		 *
		 * @param false|object|array $result Result from another filter.
		 * @param string             $action API action.
		 * @param object             $args   Request arguments.
		 * @return false|object|array
		 */
		public function plugin_info( $result, $action, $args ) {
			if ( 'plugin_information' !== $action || empty( $args->slug ) || $args->slug !== $this->slug ) {
				return $result;
			}

			$release = $this->get_release();
			if ( ! $release ) {
				return $result;
			}

			if ( ! function_exists( 'get_plugin_data' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			$plugin = get_plugin_data( WP_PLUGIN_DIR . '/' . $this->plugin_file, false, false );

			$author = $plugin['Author'];
			if ( $plugin['AuthorURI'] ) {
				$author = sprintf( '<a href="%s">%s</a>', esc_url( $plugin['AuthorURI'] ), esc_html( $plugin['Author'] ) );
			}

			$changelog = $release['changelog'] ? wp_kses_post( $release['changelog'] ) : '';
			$changelog = sprintf(
				'<h4>%1$s</h4>%2$s<p><a href="%3$s">%3$s</a></p>',
				esc_html( $release['version'] ),
				$changelog,
				esc_url( $release['url'] )
			);

			return (object) array(
				'name'          => $plugin['Name'],
				'slug'          => $this->slug,
				'version'       => $release['version'],
				'author'        => $author,
				'homepage'      => $plugin['PluginURI'] ? $plugin['PluginURI'] : $release['url'],
				'requires'      => $plugin['RequiresWP'],
				'requires_php'  => $plugin['RequiresPHP'],
				'last_updated'  => $release['published'],
				'download_link' => $release['package'],
				'sections'      => array( 'changelog' => $changelog ),
			);
		}

		/**
		 * Latest release, from cache or from GitHub.
		 *
		 * "Check again" on Dashboard > Updates skips the cache.
		 *
		 * @return array|null Null when there is no usable release.
		 */
		private function get_release() {
			if ( false !== $this->release ) {
				return $this->release;
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Only skips the cache, same as core's "Check again".
			$force  = is_admin() && isset( $_GET['force-check'] ) && current_user_can( 'update_plugins' );
			$cached = $force ? false : get_transient( $this->cache_key );

			if ( false !== $cached ) {
				$this->release = is_array( $cached ) ? $cached : null;
				return $this->release;
			}

			$this->release = $this->fetch_release();

			if ( $this->release ) {
				set_transient( $this->cache_key, $this->release, self::CACHE_TTL );
			} else {
				set_transient( $this->cache_key, 'error', self::ERROR_TTL );
			}

			return $this->release;
		}

		/**
		 * Asks GitHub for the latest release.
		 *
		 * Any problem (network, rate limit, no asset, odd tag) returns null:
		 * no update notice is better than a broken one.
		 *
		 * @return array|null
		 */
		private function fetch_release() {
			$response = wp_remote_get(
				'https://api.github.com/repos/' . $this->repo . '/releases/latest',
				array(
					'timeout' => 10,
					'headers' => array(
						// Adds body_html: the release notes already converted from Markdown.
						'Accept'               => 'application/vnd.github.html+json',
						'X-GitHub-Api-Version' => '2022-11-28',
						'User-Agent'           => 'WordPress/' . get_bloginfo( 'version' ) . '; ' . $this->slug,
					),
				)
			);

			if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
				return null;
			}

			$data = json_decode( wp_remote_retrieve_body( $response ), true );
			if ( ! is_array( $data ) || empty( $data['tag_name'] ) || ! empty( $data['draft'] ) || ! empty( $data['prerelease'] ) ) {
				return null;
			}

			$version = ltrim( (string) $data['tag_name'], 'vV' );
			if ( ! preg_match( '/^\d+\.\d+(\.\d+)?$/', $version ) ) {
				return null;
			}

			// The release asset, never the "Source code" zip GitHub adds to every release.
			$expected = 'https://github.com/' . $this->repo . '/releases/download/';
			$package  = '';
			if ( ! empty( $data['assets'] ) && is_array( $data['assets'] ) ) {
				foreach ( $data['assets'] as $asset ) {
					if (
						isset( $asset['name'], $asset['browser_download_url'] )
						&& $this->slug . '.zip' === $asset['name']
						&& 0 === strpos( $asset['browser_download_url'], $expected )
					) {
						$package = $asset['browser_download_url'];
						break;
					}
				}
			}
			if ( ! $package ) {
				return null;
			}

			return array(
				'version'   => $version,
				'package'   => $package,
				'url'       => isset( $data['html_url'] ) ? (string) $data['html_url'] : 'https://github.com/' . $this->repo . '/releases',
				'changelog' => isset( $data['body_html'] ) ? (string) $data['body_html'] : '',
				'published' => isset( $data['published_at'] ) ? (string) $data['published_at'] : '',
			);
		}
	}
}
