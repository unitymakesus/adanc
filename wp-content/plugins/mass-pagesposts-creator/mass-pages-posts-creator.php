<?php

/**
 * Plugin Name: Mass Pages/Posts Creator
 * Plugin URI: https://wordpress.org/plugins/mass-pagesposts-creator/
 * Description: Mass Pages/Posts Creator is a plugin which provide a simplest interface by which user can create multiple Pages/Posts at a time.
 * Version: 2.0.2
 * Author: Thedotstore
 * Author URI: https://www.thedotstore.com
 * Text Domain: mass-pages-posts-creator
 */
// If this file is called directly, abort.
if ( !defined( 'ABSPATH' ) ) {
    die;
}

if ( !function_exists( 'mppcp_fs' ) ) {
    // Create a helper function for easy SDK access.
    function mppcp_fs()
    {
        global  $mppcp_fs ;
        
        if ( !isset( $mppcp_fs ) ) {
            // Include Freemius SDK.
            require_once dirname( __FILE__ ) . '/freemius/start.php';
            $mppcp_fs = fs_dynamic_init( array(
                'id'              => '3481',
                'slug'            => 'mass-pagesposts-creator',
                'premium_slug'    => 'undefined',
                'type'            => 'plugin',
                'public_key'      => 'pk_d515579f040a86a51afd9f721dfed',
                'is_premium'      => false,
                'premium_suffix'  => 'Premium',
                'has_addons'      => false,
                'has_paid_plans'  => true,
                'has_affiliation' => 'selected',
                'menu'            => array(
                'slug'       => 'mass-pagesposts-creator',
                'first-path' => 'admin.php?page=mass-pages-posts-creator',
                'contact'    => false,
                'support'    => false,
            ),
                'is_live'         => true,
            ) );
        }
        
        return $mppcp_fs;
    }
    
    // Init Freemius.
    mppcp_fs();
    // Signal that SDK was initiated.
    do_action( 'mppcp_fs_loaded' );
}

$menu_page = filter_input( INPUT_GET, 'page', FILTER_SANITIZE_SPECIAL_CHARS );
$menu_tab = filter_input( INPUT_GET, 'tab', FILTER_SANITIZE_SPECIAL_CHARS );
if ( isset( $menu_page ) && (!empty($menu_page) || $menu_page === 'mass-pages-posts-creator' || $menu_page === 'mass-pagesposts-creator') || isset( $menu_tab ) && (!empty($menu_tab) || $menu_tab === 'other_plugins') ) {
    add_action( 'admin_enqueue_scripts', 'mpc_load_my_script' );
}
function mpc_load_my_script()
{
    wp_enqueue_script( 'jquery' );
    wp_enqueue_script( 'jquery-ui-dialog' );
    wp_enqueue_script(
        'choosen-jquery',
        plugin_dir_url( __FILE__ ) . 'js/chosen.jquery.min.js',
        array( 'jquery' ),
        false
    );
    wp_enqueue_style(
        'choosen-css',
        plugin_dir_url( __FILE__ ) . 'css/chosen.min.css',
        array(),
        'all'
    );
    wp_enqueue_style(
        'jquery-ui-min',
        plugin_dir_url( __FILE__ ) . 'css/jquery-ui.css',
        array(),
        'all'
    );
    wp_enqueue_script(
        'custom',
        plugin_dir_url( __FILE__ ) . 'js/custom.js',
        array(),
        'all'
    );
    wp_localize_script( 'custom', 'adminajax', array(
        'ajaxurl'   => admin_url( 'admin-ajax.php' ),
        'ajax_icon' => plugin_dir_url( __FILE__ ) . '/images/ajax-loader.gif',
    ) );
    wp_localize_script( 'custom', 'plugin_vars', array(
        'plugin_url' => plugin_dir_url( __FILE__ ),
    ) );
}

$menu_page = filter_input( INPUT_GET, 'page', FILTER_SANITIZE_SPECIAL_CHARS );
if ( isset( $menu_page ) && !empty($menu_page) && ($menu_page === 'mass-pages-posts-creator' || $menu_page === 'mass-pagesposts-creator') ) {
    add_action( 'admin_enqueue_scripts', 'mpc_styles' );
}
add_action( 'admin_init', 'mpc_welcome_mass_page_creator_screen_do_activation_redirect' );
add_action( 'admin_menu', 'mpc_welcome_pages_screen_mass_page_creator' );
add_action( 'mass_page_post_creator_about', 'mpc_mass_page_post_creator_about' );
add_action( 'admin_print_footer_scripts', 'mpc_mass_page_creator_pointers_footer' );
add_action( 'admin_menu', 'mpc_welcome_screen_mass_page_creator_remove_menus', 999 );
add_action( 'wp_ajax_page_finder_ajax', 'page_finder_ajax' );
function convert_array_to_json( $arr )
{
    $filter_data = [];
    foreach ( $arr as $key => $value ) {
        $option = [];
        $option['name'] = $value;
        $option['attributes']['value'] = $key;
        $filter_data[] = $option;
    }
    return $filter_data;
}

function page_finder_ajax()
{
    $fee_value = filter_input( INPUT_POST, 'value', FILTER_SANITIZE_STRING );
    $value = ( isset( $fee_value ) ? $fee_value : '' );
    $query = new WP_Query( array(
        'post_parent' => 0,
        'post_type'   => "page",
        'post_status' => 'publish',
        's'           => $value,
        'showposts'   => -1,
    ) );
    $parent_pages_num = $query->found_posts;
    $options = [];
    
    if ( $parent_pages_num > 0 ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $options[esc_attr( $query->post->ID )] = esc_html( $query->post->post_title );
        }
    } else {
        $options['0'] = esc_html( 'No List Found', 'mass-pages-posts-creator' );
    }
    
    echo  wp_json_encode( convert_array_to_json( $options ) ) ;
    // WPCS: XSS OK.
    wp_die();
}

function mpc_welcome_mass_page_creator_screen_do_activation_redirect()
{
    if ( !get_transient( '_mass_page_post_creator_welcome_screen' ) ) {
        return;
    }
    // Delete the redirect transient
    delete_transient( '_mass_page_post_creator_welcome_screen' );
    // if activating from network, or bulk
    $is_activate = filter_input( INPUT_GET, 'activate-multi', FILTER_SANITIZE_STRING );
    if ( is_network_admin() || isset( $is_activate ) ) {
        return;
    }
    // Redirect to extra cost welcome  page
    wp_safe_redirect( add_query_arg( array(
        'page' => 'mass-pagesposts-creator&tab=about',
    ), admin_url( 'index.php' ) ) );
    exit;
}

function mpc_welcome_pages_screen_mass_page_creator()
{
    add_dashboard_page(
        'Mass-Pages/Posts-Creator Dashboard',
        'Mass Pages/Posts Creator Dashboard',
        'read',
        'mass-pagesposts-creator',
        'mpc_welcome_screen_content_mass_page_creator'
    );
}

function mpc_welcome_screen_mass_page_creator_remove_menus()
{
    remove_submenu_page( 'index.php', 'mass-pagesposts-creator' );
}

function mpc_welcome_screen_content_mass_page_creator()
{
    wp_enqueue_style( 'wp-pointer' );
    wp_enqueue_script( 'wp-pointer' );
    ?>

	<div class="wrap about-wrap">
		<h1 style="font-size: 2.1em;"><?php 
    printf( esc_html( 'Welcome to Mass Pages/Posts Creator', 'mass-pages-posts-creator' ) );
    ?></h1>

		<div class="about-text woocommerce-about-text">
			<div class="paragrapth_img">
				<img class="version_logo_img"
				     src="<?php 
    echo  esc_url( plugin_dir_url( __FILE__ ) . 'images/mass-pagesposts-creator.png' ) ;
    ?>">
			</div>
			<div class="paragrapth_text">
				<?php 
    $message = '';
    printf( esc_html( '%s Mass Pages/Posts Creator is a plugin which provide a simplest interface by which user can create multiple Pages/Posts at a time.', 'mass-pages-posts-creator' ), esc_html( $message ) );
    ?>
			</div>
		</div>

		<?php 
    $setting_tabs_wc = apply_filters( 'mass_page_post_creator_setting_tab', array(
        "about" => "Overview",
    ) );
    $tab = filter_input( INPUT_GET, 'tab', FILTER_SANITIZE_STRING );
    $current_tab_wc = ( isset( $tab ) ? sanitize_text_field( $tab ) : 'general' );
    ?>
		<h2 id="woo-extra-cost-tab-wrapper" class="nav-tab-wrapper">
			<?php 
    foreach ( $setting_tabs_wc as $name => $label ) {
        echo  '<a href="' . esc_url( home_url( 'wp-admin/index.php?page=mass-page-post-creator&tab=' . esc_attr( $name ) ) ) . '" class="nav-tab ' . (( $current_tab_wc === $name ? 'nav-tab-active' : '' )) . '">' . esc_attr( $label ) . '</a>' ;
    }
    ?>
		</h2>
		<?php 
    foreach ( $setting_tabs_wc as $key => $setting_tabvalue ) {
        $setting_tabkey_wc = $key;
        switch ( $setting_tabkey_wc ) {
            case $current_tab_wc:
                do_action( 'mass_page_post_creator_' . $current_tab_wc );
                break;
        }
    }
    ?>
		<hr />
		<div class="return-to-dashboard">
			<a href="<?php 
    echo  esc_url( home_url( '/wp-admin/admin.php?page=mass-pages-posts-creator' ) ) ;
    ?>"><?php 
    esc_html_e( 'Go to Mass Pages/Posts Creator Settings', 'mass-pages-posts-creator' );
    ?></a>
		</div>
	</div>
	<?php 
}

function mpc_mass_page_post_creator_about()
{
    ?>
	<div class="changelog">
		</br>
		<style type="text/css">
			p.mass_page_post_creator_overview {
				max-width: 100% !important;
				margin-left: auto;
				margin-right: auto;
				font-size: 15px;
				line-height: 1.5;
			}

			.mass_page_post_creator_content_ul ul li {
				margin-left: 3%;
				list-style: initial;
				line-height: 23px;
			}
		</style>
		<div class="changelog about-integrations">
			<div class="wc-feature feature-section col three-col">
				<div>
					<p class="mass_page_post_creator_overview"><?php 
    esc_html_e( 'Mass Pages Posts Creator through which User can create Pages/Posts easily by the simplest interface which provide all the attribute which are necessary while creating a Pages/Posts. One unique functionality added to this plugin is user can also add Postfix & Prefix word for all Pages/Posts which is common for all. This plugin will include all attribute like status, parent page, template, type, comments status, author, etc.. which will make easy to user while creating Pages/Posts.', 'mass-pages-posts-creator' );
    ?></p>

					<p class="mass_page_post_creator_overview">
						<strong><?php 
    esc_html_e( 'Key Features:', 'mass-pages-posts-creator' );
    ?></strong></p>
					<div class="mass_page_post_creator_content_ul">
						<ul>
							<li><?php 
    esc_html_e( 'Create hundreds of pages or posts with a single click', 'mass-pages-posts-creator' );
    ?></li>
							<li><?php 
    esc_html_e( 'Allows you to enter prefix and postfix keywords for the name of pages or posts', 'mass-pages-posts-creator' );
    ?></li>
							<li><?php 
    esc_html_e( 'You can specify range or comma separated values to create posts in bulk', 'mass-pages-posts-creator' );
    ?></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php 
}

function mpc_mass_page_creator_pointers_footer()
{
    $admin_pointers = mpc_mass_page_creator_pointers_admin_pointers();
    ?>
	<script type="text/javascript">
			/* <![CDATA[ */
			(function( $ ) {
				if ( 'undefined' !== typeof(jQuery().pointer) ) {
			<?php 
    foreach ( $admin_pointers as $pointer => $array ) {
        
        if ( $array['active'] ) {
            ?>
					$( '<?php 
            echo  esc_html( $array['anchor_id'] ) ;
            ?>' ).pointer( {
						content: '<?php 
            echo  esc_html( $array['content'] ) ;
            ?>',
						position: {
							edge: '<?php 
            echo  esc_html( $array['edge'] ) ;
            ?>',
							align: '<?php 
            echo  esc_html( $array['align'] ) ;
            ?>'
						},
						close: function() {
							$.post( ajaxurl, {
								pointer: '<?php 
            echo  esc_html( $pointer ) ;
            ?>',
								action: 'dismiss-wp-pointer'
							} );
						}
					} ).pointer( 'open' );
			<?php 
        }
    
    }
    ?>
				}
			})( jQuery );
			/* ]]> */
	</script>
	<?php 
}

function mpc_mass_page_creator_pointers_admin_pointers()
{
    $dismissed = explode( ',', (string) get_user_meta( get_current_user_id(), 'dismissed_wp_pointers', true ) );
    $version = '1_0';
    // replace all periods in 1.0 with an underscore
    $prefix = 'mpc_mass_page_creator_pointers_admin_pointers' . $version . '_';
    $new_pointer_content = '<h3>' . __( 'Welcome to  Mass Pages/Posts Creator', 'mass-pages-posts-creator' ) . '</h3>';
    $new_pointer_content .= '<p>' . __( 'Mass Pages/Posts Creator is a plugin which provide a simplest interface by which user can create multiple Pages/Posts at a time.', 'mass-pages-posts-creator' ) . '</p>';
    return array(
        $prefix . 'mpc_mass_page_creator_pointers_admin_pointers' => array(
        'content'   => $new_pointer_content,
        'anchor_id' => '#toplevel_page_mass-pages-posts-creator',
        'edge'      => 'left',
        'align'     => 'left',
        'active'    => !in_array( $prefix . 'mpc_mass_page_creator_pointers_admin_pointers', $dismissed, true ),
    ),
    );
}

function mpc_styles()
{
    wp_enqueue_style(
        'style-css',
        plugin_dir_url( __FILE__ ) . 'css/style.css',
        array( 'wp-jquery-ui-dialog' ),
        '1.1.1',
        'all'
    );
}

function mpc_pages_posts_creator()
{
    add_menu_page(
        'Mass Pages/Posts Creator',
        'Mass Pages/Posts Creator Page',
        'manage_options',
        'mass-pages-posts-creator',
        'mpc_create'
    );
}

add_action( 'admin_menu', 'mpc_pages_posts_creator' );
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ), true ) ) {
    add_filter(
        'woocommerce_paypal_args',
        'mpc_paypal_bn_code_filter_mass_pagesposts_creator',
        99,
        1
    );
}
function mpc_paypal_bn_code_filter_mass_pagesposts_creator( $paypal_args )
{
    $paypal_args['bn'] = 'Multidots_SP';
    return $paypal_args;
}

function mpc_create()
{
    ?>
	<div class="wrap">

		<form id="createForm" method="post" class="">
			<?php 
    $nonce = wp_create_nonce( 'mass_pages_posts_creator_nonce' );
    ?>
			<input type="hidden" name="mass_pages_posts_creator" id="mass_pages_posts_creator"
			       value="<?php 
    echo  esc_attr( $nonce ) ;
    ?>" />
			<?php 
    ?>
				<h2><?php 
    esc_html_e( 'Mass Pages/Posts Creator', 'mass-pages-posts-creator' );
    ?></h2>
				<?php 
    ?>
			<table class="form-table">
				<tr class="page_prefix_tr">
					<th><?php 
    esc_html_e( 'Prefix of Pages/Posts', 'mass-pages-posts-creator' );
    ?></th>
					<td><input type="text" class="regular-text" value="" id="page_prefix" name="page_prefix">
					</td>
				</tr>
				<tr class="page_post_tr">
					<th><?php 
    esc_html_e( 'Postfix of Pages/Posts', 'mass-pages-posts-creator' );
    ?></th>
					<td><input type="text" class="regular-text" value="" id="page_postfix" name="page_postfix">
					</td>
				</tr>
				<tr class="pages_list_tr">
					<th><?php 
    esc_html_e( 'List of Pages/Posts', 'mass-pages-posts-creator' );
    ?></br><?php 
    esc_html_e( '(Comma Separated)', 'mass-pages-posts-creator' );
    ?>
						<b>(*)</b></th>
					<td>
						<textarea class="code" id="pages_list" cols="60" rows="5" name="pages_list"></textarea>
						<p class="description"><?php 
    esc_html_e( 'eg. Test1, Test2, test3, test4, test5', 'mass-pages-posts-creator' );
    ?></p>
					</td>
				</tr>
				<tr class="pages_content_tr">
					<th><?php 
    esc_html_e( 'Content of Pages/Posts', 'mass-pages-posts-creator' );
    ?></th>
					<td>
						<?php 
    $pages_content = filter_input( INPUT_POST, 'pages_content', FILTER_SANITIZE_STRING );
    $content = ( isset( $pages_content ) ? htmlspecialchars_decode( $pages_content ) : '' );
    ?>
						<?php 
    wp_editor( $content, 'pages_content', array(
        'textarea_name' => 'pages_content',
        'editor_class'  => 'requiredField',
        'textarea_rows' => '6',
        'media_buttons' => true,
        'tinymce'       => true,
    ) );
    ?>
						<p class="description"><?php 
    esc_html_e( 'eg. It is a long established fact that a reader will be distracted by the
                            readable content of a page when looking at its layout.', 'mass-pages-posts-creator' );
    ?></p>
					</td>
				</tr>
				<tr class="excerpt_content_tr">
					<th><?php 
    esc_html_e( 'Excerpt Content', 'mass-pages-posts-creator' );
    ?></th>
					<td><textarea class="code" id="excerpt_content" cols="60" rows="5"
					              name="excerpt_content"></textarea>
						<p class="description"><?php 
    esc_html_e( 'eg. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 'mass-pages-posts-creator' );
    ?></p>
					</td>
				</tr>
				<tr class="page_prefix_tr">
					<th><?php 
    esc_html_e( 'Number of posts', 'mass-pages-posts-creator' );
    ?></th>
					<td><input type="number" id="no_post_add" name="no_post_add" value="1" min="1"></td>
				</tr>
				<tr class="type_tr">
					<th><?php 
    esc_html_e( 'Type', 'mass-pages-posts-creator' );
    ?> <b>(*)</b></th>
					<td>
						<select id="type">
							<option value="none"><?php 
    esc_html_e( 'Select Type', 'mass-pages-posts-creator' );
    ?></option>
							<option value="page"><?php 
    esc_html_e( 'Page', 'mass-pages-posts-creator' );
    ?></option>
							<option value="post"><?php 
    esc_html_e( 'Post', 'mass-pages-posts-creator' );
    ?></option>
						</select>
					</td>
				</tr>
				<?php 
    ?>
					<tr class="template_name_tr">
						<th><?php 
    esc_html_e( 'Templates - Available in Pro', 'mass-pages-posts-creator' );
    ?></th>
						<td>
							<select id="template_name">
								<option value=""><?php 
    esc_html_e( 'Select Template', 'mass-pages-posts-creator' );
    ?></option>
								<option value="" disabled><?php 
    esc_html_e( 'In Pro', 'mass-pages-posts-creator' );
    ?></option>
							</select>
						</td>
					</tr>
				<?php 
    ?>
				<tr class="page_status_tr">
					<th><?php 
    esc_html_e( 'Pages/Posts Status', 'mass-pages-posts-creator' );
    ?></th>
					<td>
						<select id="page_status">
							<?php 
    ?>
								<option value="publish"
								        disabled><?php 
    esc_html_e( 'Publish - In Pro', 'mass-pages-posts-creator' );
    ?></option>
							<?php 
    ?>
							<option value="pending"><?php 
    esc_html_e( 'Pending', 'mass-pages-posts-creator' );
    ?></option>
							<option value="draft"><?php 
    esc_html_e( 'Draft', 'mass-pages-posts-creator' );
    ?></option>
							<option value="auto-draft"><?php 
    esc_html_e( 'Auto Draft', 'mass-pages-posts-creator' );
    ?></option>
							<option value="private"><?php 
    esc_html_e( 'Private', 'mass-pages-posts-creator' );
    ?></option>
							<option value="trash"><?php 
    esc_html_e( 'Trash', 'mass-pages-posts-creator' );
    ?></option>
						</select>
					</td>
				</tr>
				<?php 
    ?>
					<tr class="comment_status_tr">
						<th><?php 
    esc_html_e( 'Pages/Posts Comment Status - Available in Pro', 'mass-pages-posts-creator' );
    ?></th>
						<td>
							<select id="comment_status">
								<option value=""><?php 
    esc_html_e( 'Select Comment Status', 'mass-pages-posts-creator' );
    ?></option>
								<option value="open"
								        disabled><?php 
    esc_html_e( 'Open - In Pro', 'mass-pages-posts-creator' );
    ?></option>
								<option value="closed"
								        disabled><?php 
    esc_html_e( 'Closed - In Pro', 'mass-pages-posts-creator' );
    ?></option>
							</select>
						</td>
					</tr>
				<?php 
    ?>
				<?php 
    ?>
					<tr class="authors_tr">
						<th><?php 
    esc_html_e( 'Author - Available in Pro', 'mass-pages-posts-creator' );
    ?></th>
						<td>
							<select id="authors">
								<option value=""><?php 
    esc_html_e( 'Select Author', 'mass-pages-posts-creator' );
    ?></option>
								<option value="" disabled><?php 
    esc_html_e( 'In Pro', 'mass-pages-posts-creator' );
    ?></option>
							</select>
						</td>
					</tr>
				<?php 
    ?>
				<?php 
    ?>
					<tr class="parent_page_id_tr">
						<th><?php 
    esc_html_e( 'Parent Pages - Available in Pro', 'mass-pages-posts-creator' );
    ?></th>
						<td>
							<?php 
    $html = '<select id="page-filter-free" name="pages[]" class="chosen-select-attribute-value chosen-ltr pages_values">';
    $html .= '<option value="">In Pro</option>';
    $html .= '</select>';
    echo  wp_kses( $html, allowed_html_tags() ) ;
    ?>

						</td>
					</tr>
				<?php 
    ?>
			</table>
			<p class="submit"><input type="button" id="btn_submit" class="button button-primary"
			                         name="btn_submit"
			                         value="<?php 
    esc_html_e( 'Create', 'mass-pages-posts-creator' );
    ?>" />
			</p>
		</form>
		<div id="message"></div>
		<div id="result"></div>
	</div>
	<?php 
}

function mpc_ajax_action()
{
    // verify nonce
    check_ajax_referer( 'mass_pages_posts_creator_nonce', 'security' );
    $prefix_word = filter_input( INPUT_POST, 'prefix_word', FILTER_SANITIZE_SPECIAL_CHARS );
    $postfix_word = filter_input( INPUT_POST, 'postfix_word', FILTER_SANITIZE_SPECIAL_CHARS );
    $pages_content = filter_input( INPUT_POST, 'pages_content', FILTER_SANITIZE_SPECIAL_CHARS );
    $parent_page_id = filter_input( INPUT_POST, 'parent_page_id', FILTER_SANITIZE_SPECIAL_CHARS );
    $template_name = filter_input( INPUT_POST, 'template_name', FILTER_SANITIZE_SPECIAL_CHARS );
    $type = filter_input( INPUT_POST, 'type', FILTER_SANITIZE_SPECIAL_CHARS );
    $page_status = filter_input( INPUT_POST, 'page_status', FILTER_SANITIZE_SPECIAL_CHARS );
    $authors = filter_input( INPUT_POST, 'authors', FILTER_SANITIZE_SPECIAL_CHARS );
    $excerpt_content = filter_input( INPUT_POST, 'excerpt_content', FILTER_SANITIZE_SPECIAL_CHARS );
    $no_post_add = filter_input( INPUT_POST, 'no_post_add', FILTER_SANITIZE_SPECIAL_CHARS );
    $comment_status = filter_input( INPUT_POST, 'comment_status', FILTER_SANITIZE_SPECIAL_CHARS );
    $pages_list = filter_input( INPUT_POST, 'pages_list', FILTER_SANITIZE_SPECIAL_CHARS );
    $prefix_word = sanitize_text_field( wp_unslash( $prefix_word ) );
    $postfix_word = sanitize_text_field( wp_unslash( $postfix_word ) );
    $pages_content = htmlspecialchars_decode( $pages_content );
    $parent_page_id = sanitize_text_field( wp_unslash( $parent_page_id ) );
    $template_name = sanitize_text_field( wp_unslash( $template_name ) );
    $type = sanitize_text_field( wp_unslash( $type ) );
    $page_status = sanitize_text_field( wp_unslash( $page_status ) );
    $authors = sanitize_text_field( wp_unslash( $authors ) );
    $excerpt_content = sanitize_textarea_field( $excerpt_content );
    $no_post_add = sanitize_text_field( wp_unslash( $no_post_add ) );
    $comment_status = sanitize_text_field( wp_unslash( $comment_status ) );
    $pages_list = sanitize_textarea_field( $pages_list );
    $page_list = explode( ",", $pages_list );
    
    if ( $no_post_add === '' ) {
        $no_post_count = 1;
    } else {
        $no_post_count = $no_post_add;
    }
    
    $responsedata = [];
    foreach ( range( 1, $no_post_count ) as $i ) {
        foreach ( $page_list as $page_name ) {
            $my_post = array(
                'post_title'     => $prefix_word . ' ' . $page_name . ' ' . $postfix_word,
                'post_type'      => $type,
                'post_content'   => $pages_content,
                'post_author'    => $authors,
                'post_parent'    => $parent_page_id,
                'post_status'    => $page_status,
                'post_excerpt'   => $excerpt_content,
                'comment_status' => $comment_status,
            );
            $last_insert_id = wp_insert_post( $my_post );
            update_post_meta( $last_insert_id, 'post_number', $i );
            
            if ( 'draft' === $page_status ) {
                $url = get_permalink( $last_insert_id ) . '&preview=true';
            } else {
                
                if ( 'auto-draft' === $page_status ) {
                    $url = '-';
                } else {
                    $url = get_permalink( $last_insert_id );
                }
            
            }
            
            $data = [];
            $data['id'] = esc_html( $last_insert_id );
            $data['pagename'] = esc_html( $page_name );
            $data['status'] = esc_html( "Ok" );
            
            if ( 'auto-draft' === $page_status || 'trash' === $page_status ) {
                $data['url'] = __( "-", 'mass-pages-posts-creator' );
            } else {
                $data['url'] = $url;
            }
            
            add_post_meta( $last_insert_id, '_wp_page_template', $template_name );
        }
        $responsedata[] = $data;
    }
    echo  wp_json_encode( $responsedata ) ;
    wp_die();
}

add_action( 'wp_ajax_mpc_ajax_action', 'mpc_ajax_action' );
add_action( 'wp_ajax_nopriv_mpc_ajax_action', 'mpc_ajax_action' );
function mpc_activate()
{
    set_transient( '_mass_page_post_creator_welcome_screen', true, 30 );
}

register_activation_hook( __FILE__, 'mpc_activate' );
function mpc_deactivate()
{
}

register_deactivation_hook( __FILE__, 'mpc_deactivate' );
$menu_page = filter_input( INPUT_GET, 'page', FILTER_SANITIZE_SPECIAL_CHARS );
$menu_tab = filter_input( INPUT_GET, 'tab', FILTER_SANITIZE_SPECIAL_CHARS );
if ( isset( $menu_page ) && (!empty($menu_page) || $menu_page === 'mass-pages-posts-creator' || $menu_page === 'mass-pagesposts-creator') || isset( $menu_tab ) && (!empty($menu_tab) || $menu_tab === 'other_plugins') ) {
    add_filter( 'admin_footer_text', 'mppc_admin_footer_review' );
}
function mppc_admin_footer_review()
{
    echo  sprintf( wp_kses( __( 'If you like <strong>Mass Pages/Posts Creator</strong> plugin, please leave us ★★★★★ ratings on <a href="%1$s" target="_blank">DotStore</a>.', 'mass-pages-posts-creator' ), array(
        'strong' => array(),
        'a'      => array(
        'href'   => array(),
        'target' => 'blank',
    ),
    ) ), esc_url( 'https://wordpress.org/plugins/mass-pagesposts-creator/#reviews' ) ) ;
    return '';
}

function allowed_html_tags( $tags = array() )
{
    $allowed_tags = array(
        'a'        => array(
        'href'  => array(),
        'title' => array(),
        'class' => array(),
    ),
        'ul'       => array(
        'class' => array(),
    ),
        'li'       => array(
        'class' => array(),
    ),
        'div'      => array(
        'class' => array(),
        'id'    => array(),
    ),
        'select'   => array(
        'id'       => array(),
        'name'     => array(),
        'class'    => array(),
        'multiple' => array(),
        'style'    => array(),
    ),
        'input'    => array(
        'id'    => array(),
        'value' => array(),
        'name'  => array(),
        'class' => array(),
        'type'  => array(),
    ),
        'textarea' => array(
        'id'    => array(),
        'name'  => array(),
        'class' => array(),
    ),
        'option'   => array(
        'id'       => array(),
        'selected' => array(),
        'name'     => array(),
        'value'    => array(),
    ),
        'br'       => array(),
        'em'       => array(),
        'strong'   => array(),
    );
    if ( !empty($tags) ) {
        foreach ( $tags as $key => $value ) {
            $allowed_tags[$key] = $value;
        }
    }
    return $allowed_tags;
}
