<?php

namespace App;

// Resources
function resources_post_type() {
  register_post_type( 'ada-resource', array(
    'labels' => array(
				'name' => 'Resources',
				'singular_name' => 'Resource',
				'add_new' => 'Add New',
				'add_new_item' => 'Add New Resource',
				'edit' => 'Edit',
				'edit_item' => 'Edit Resource',
				'new_item' => 'New Resource',
				'view_item' => 'View Resource',
				'search_items' => 'Search Resources',
				'not_found' =>  'Nothing found in the Database.',
				'not_found_in_trash' => 'Nothing found in Trash',
				'parent_item_colon' => ''
    ),
    'public' => true,
    'exclude_from_search' => false,
    'publicly_queryable' => true,
    'show_ui' => true,
    'show_in_nav_menus' => false,
    'menu_position' => 23,
    'menu_icon' => 'dashicons-media-document',
    'capability_type' => 'page',
    'hierarchical' => false,
    'supports' => array(
      'title',
      'author',
      'revisions',
      'page-attributes',
    ),
    'has_archive' => false,
    'rewrite' => array(
      'slug' => 'resource'
    )
  ));

	register_taxonomy('resource-topic',  array('post', 'ada-resource'), array(
		'labels' => array(
			'name' => __( 'Topics' ),
			'singular_name' => __( 'Topic' )
		),
		'publicly_queryable' => true,
		'show_ui' => true,
		'show_in_nav_menus' => false,
		'hierarchical' => true,
		'rewrite' => true
	));

  	register_taxonomy('resource-type', 'ada-resource', array(
  		'labels' => array(
  			'name' => __( 'Types' ),
  			'singular_name' => __( 'Type' )
  		),
  		'publicly_queryable' => true,
  		'show_ui' => true,
  		'show_in_nav_menus' => false,
  		'hierarchical' => true,
  		'rewrite' => true
  	));

	register_taxonomy('resource-source', 'ada-resource', array(
		'labels' => array(
			'name' => __( 'Sources' ),
			'singular_name' => __( 'Source' )
		),
		'publicly_queryable' => true,
		'show_ui' => true,
		'show_in_nav_menus' => false,
		'hierarchical' => true,
		'rewrite' => true
	));
}

add_action( 'init', __NAMESPACE__.'\\resources_post_type' );


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
