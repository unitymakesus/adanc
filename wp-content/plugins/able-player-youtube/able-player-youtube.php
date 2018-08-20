<?php
/**
 * Plugin Name: YouTube A11y Player
 * Description: An accessible interface for YouTube videos using Able Player.
 * Plugin URI:  https://www.unitymakes.us/
 * Author:      Alisa Herr
 * Author URI:  https://www.unitymakes.us/
 * Version:     1.0
 * Text Domain: yt-a11y
 * License:     GPL2
 */

define( 'YTAY_PLUGIN_FILE', __FILE__);
define( 'YTAY_PLUGIN_DIR', dirname( __FILE__ ) );
define( 'YTAY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
* Init action
* http://codex.wordpress.org/Function_Reference/add_action
*/
function ytay_init(){
  wp_register_style( 'ytay_ableplayer_css', YTAY_PLUGIN_URL. 'ableplayer/build/ableplayer.min.css' );

  wp_register_script( 'ytay_modernizr', YTAY_PLUGIN_URL . 'ableplayer/thirdparty/modernizr.custom.js', array(), false, false );
  wp_register_script( 'ytay_cookies', YTAY_PLUGIN_URL . 'ableplayer/thirdparty/js.cookie.js', array('jquery'), false, false );
  wp_register_script( 'ytay_google_api', '//apis.google.com/js/client.js?onload=initGoogleClientApi', array(), false, false );
  wp_register_script( 'ytay_ableplayer_js', YTAY_PLUGIN_URL . 'ableplayer/build/ableplayer.js', array('jquery', 'ytay_cookies', 'ytay_modernizr', 'ytay_google_api'), false, false );

  // wp_localize_script( 'ytay_ableplayer_js', 'ytay',  );
  wp_add_inline_script( 'ytay_google_api', 'var youTubeDataAPIKey = "' . get_option('ytay_setting_youtube') . '";', 'before');
  wp_add_inline_script( 'ytay_google_api', 'var googleApiReady = false;', 'before');
  wp_add_inline_script( 'ytay_google_api', 'function initGoogleClientApi() { googleApiReady = true; }', 'before');

  if(is_page('self-advocacy-tools')){
    wp_enqueue_style('ytay_css');
    wp_enqueue_style('ytay_ableplayer_css');
    wp_enqueue_script('ytay_modernizr');
    wp_enqueue_script('ytay_cookies');
    wp_enqueue_script('ytay_google_api');
    wp_enqueue_script('ytay_ableplayer_js');
  }

}
add_action( 'init', 'ytay_init' );

/**
 * Shortcode player
 * http://codex.wordpress.org/Function_Reference/add_shortcode
 */
function ytay_shortcode_player($atts){
  $atts = shortcode_atts( array(
		'id' => '',
    'unlisted' => FALSE
	), $atts );

  if (!empty($atts['id'])) {
    wp_enqueue_style('ytay_css');
    wp_enqueue_style('ytay_ableplayer_css');
    wp_enqueue_script('ytay_modernizr');
    wp_enqueue_script('ytay_cookies');
    wp_enqueue_script('ytay_google_api');
    wp_enqueue_script('ytay_ableplayer_js');

    $ableplayer = '<video class="ajax-video" preload="auto" data-able-player id="video-' . $atts['id'] . '" debug="true" autoplay="false" data-youtube-id="' . $atts['id'] . '" data-unlisted-fix="'. $atts['unlisted'] . '" playsinline></video>';
    
    return $ableplayer;
  }
}
add_shortcode( 'youtube', 'ytay_shortcode_player' );

/**
 * Add add_menu page
 * http://codex.wordpress.org/Function_Reference/add_menu_page
 */
function ytay_admin_menu(){
  add_options_page( "YouTube A11y Player",
                 "YouTube A11y Player Settings",
                 'manage_options',
                 'youtube_a11y',
                 'youtube_a11y_settings');
}
add_action( 'admin_menu', 'ytay_admin_menu' );

/**
 * add_menu_page callback
 */
function youtube_a11y_settings(){
  // print 'Here is the custom admin page'; return; // proof

  // save the submission
  if (isset($_GET['ytay_save'])){
    // TODO --
    // each of these update_option functions should sanitize data first (not shown in this example)
    if (isset($_POST['ytay_find'])){
      update_option('ytay_find', $_POST['ytay_find']);
    }

    if (isset($_POST['ytay_replace'])){
      update_option('ytay_replace', $_POST['ytay_replace']);
    }
    // redirect back to form
    wp_redirect($_SERVER['HTTP_REFERER']);
    exit();
  }

  // show the form
  youtube_a11y_settings_form();
}

/**
 * Settings page form
 */
function youtube_a11y_settings_form(){
  $ytay_find = get_option( 'ytay_find', '' );
  $ytay_replace = get_option( 'ytay_replace', '' );
  ?>
  <div class="wrap">
    <h1>YouTube A11y Player Settings</h1>
    <p>Starting with 2.3.1, a YouTube Data API key is required for playing YouTube videos in Able Player.
      Get a YouTube Data API key by registering your application at the
      <a href="https://console.developers.google.com/" target="_blank" rel="noopener">Google Developer Console</a>.
      For complete instructions, see
      <a href="https://developers.google.com/api-client-library/javascript/start/start-js#Getkeysforyourapplication" target="_blank" rel="noopener">Google's Getting Started page</a>.</p>

      <p>Note: All that's needed for playing YouTube videos in Able Player is a simple API key, not OAuth 2.0.</p>

    <form action="options.php" method="post">
      <?php
      settings_fields('youtube_a11y');
      do_settings_sections( 'youtube_a11y' );
      submit_button();
      ?>
    </form>
  </div>
  <?php
}

/**
 * Add settings fields
 * https://codex.wordpress.org/Settings_API
 */
function ytay_settings_api_init() {
	// Add the section to settings so we can add our fields to it
	add_settings_section(
  	'ytay_setting_section',
  	false,
  	false,
  	'youtube_a11y'
  );

	// Add the field with the names and function to use for our new settings, put it in our new section
	add_settings_field(
  	'ytay_setting_youtube',
  	'YouTube API Key',
  	'ytay_youtube_callback',
  	'youtube_a11y',
  	'ytay_setting_section'
  );

	// Register our setting so that $_POST handling is done for us and our callback function just has to echo the <input>
	register_setting( 'youtube_a11y', 'ytay_setting_youtube' );
}
add_action( 'admin_init', 'ytay_settings_api_init' );

function ytay_youtube_callback() {
 	echo '<input name="ytay_setting_youtube" id="ytay_setting_youtube" type="text" class="code" value="' . get_option( 'ytay_setting_youtube' ) . '" />';
}

/**
 * Complex find and replace based on DB setting
 */
function ytay_the_content_with_setting($content){
  $ytay_find = get_option('ytay_find', '');

  if (!empty($ytay_find)){
    // allow for comma separated value
    $ytay_find = explode( ",", $itpf_find);
    $ytay_find = array_map( "trim", $ytay_find) ;
    $ytay_replace = get_option( 'ytay_replace', '' );
    return str_ireplace( $ytay_find, $ytay_replace, $content );
  }
  else {
    return $content;
  }
}
add_filter( 'the_content', 'ytay_the_content_with_setting' );

// */
// shortcodes in sidebars
add_filter( 'widget_text', 'shortcode_unautop');
add_filter( 'widget_text', 'do_shortcode');
