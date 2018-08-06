<?php

namespace App;

// Team Post Type
function staff_post_type() {
	$labels = array(
		'name' => _x("Staff", "post type general name"),
		'singular_name' => _x("Staff", "post type singular name"),
		'menu_name' => 'Staff Members',
		'add_new' => _x("Add New", "staff profile"),
		'add_new_item' => __("Add New Staff Member"),
		'edit_item' => __("Edit Profile"),
		'new_item' => __("New Profile"),
		'view_item' => __("View Profile"),
		'parent_item_colon' => ''
	);

	register_post_type('staff' , array(
		'labels' => $labels,
		'exclude_from_search' => true,
    'publicly_queryable' => true,
    'show_in_nav_menus' => false,
    'query_var' => false,
    'show_ui' => true,
    'has_archive' => true,
		'menu_icon' => 'dashicons-admin-users',
		'supports' => array('title', 'editor', 'thumbnail', 'page-attributes')
	) );

  register_taxonomy( strtolower($singular), 'staff', array(
    'public' => false,
    'show_ui' => true,
    'show_in_nav_menus' => false,
    'hierarchical' => false,
    'query_var' => true,
    'rewrite' => false,
    'labels' => $labels
  ) );
}

add_action( 'init', __NAMESPACE__.'\\staff_post_type' );


// Services Post type
function services_post_type() {
	$labels = array(
		'name' => _x("Services", "post type general name"),
		'singular_name' => _x("Services", "post type singular name"),
		'menu_name' => 'Services',
		'add_new' => _x("Add New", "service"),
		'add_new_item' => __("Add New Service"),
		'edit_item' => __("Edit Profile"),
		'new_item' => __("New Profile"),
		'view_item' => __("View Profile"),
		'parent_item_colon' => ''
	);

	register_post_type('services' , array(
		'labels' => $labels,
		'exclude_from_search' => true,
    'publicly_queryable' => true,
    'show_in_nav_menus' => false,
    'query_var' => false,
    'show_ui' => true,
    'has_archive' => true,
		'menu_icon' => 'dashicons-admin-page',
		'supports' => array('title', 'editor', 'thumbnail', 'page-attributes')
	) );

  register_taxonomy( strtolower($singular), 'services', array(
    'public' => false,
    'show_ui' => true,
    'show_in_nav_menus' => false,
    'hierarchical' => false,
    'query_var' => true,
    'rewrite' => false,
    'labels' => $labels
  ) );
}

add_action( 'init', __NAMESPACE__.'\\services_post_type' );
