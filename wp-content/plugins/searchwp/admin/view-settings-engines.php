<?php

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( class_exists( 'SearchWPUpgrade' ) && empty( SWP()->settings['engines'] ) ) {
	$swp_upgrader = new SearchWPUpgrade();
	$swp_upgrader->install();
}

$indexer = new SearchWPIndexer();
$indexer->update_running_counts();

do_action( 'searchwp_settings_engines' );

// The data store
$data = array();

$nonces = array(
	'basic_auth',
	'engines',
	'get_index_stats',
	'get_tax_terms',
	'index_dirty',
	'reset_index',
	'initial_settings',
	'legacy_engines',
	'recreate_tables',
);

// We need a reference to all post type objects, their taxonomies, and their metadata
foreach ( SWP()->postTypes as $post_type ) {
	$post_type_obj = get_post_type_object( $post_type );

	// Get all the taxonomies for this post type in the format Vue wants
	$taxonomy_objects = get_object_taxonomies( $post_type, 'objects' );
	$taxonomies = array();
	foreach ( $taxonomy_objects as $taxonomy_key => $taxonomy ) {

		$tax_label = $taxonomy->label;

		if ( apply_filters( 'searchwp_engine_use_taxonomy_name', false ) ) {
			$tax_label = $taxonomy->name;
		}

		$taxonomies[] = array(
			'name' => $taxonomy->name,
			'value' => $taxonomy->name,
			'label' => $tax_label,
		);

		$nonces[] = 'tax_' . $taxonomy->name . '_' . $post_type;
	}

	$meta_keys_for_post_type = searchwp_get_meta_keys_for_post_type( $post_type );

	$data['objects'][ $post_type ] = array(
		'name'        => $post_type,
		'label'       => $post_type_obj->labels->name,
		'taxonomies'  => $taxonomies,
		'meta_keys'   => $meta_keys_for_post_type,
		'supports'    => searchwp_get_supports_for_post_type( $post_type_obj ),
		'meta_groups' => (array) apply_filters( 'searchwp_meta_groups', array(), array(
			'post_type' => $post_type,
			'meta_keys' => $meta_keys_for_post_type,
		) ),
	);

	if ( 'attachment' == $post_type
			|| apply_filters( "searchwp_enable_parent_attribution_{$post_type}", false )
	) {
		$data['objects'][ $post_type ]['attribution'] = 'parent';
	} else {
		$data['objects'][ $post_type ]['attribution'] = 'id';
	}
}

// We need the index stats
$data['index_stats'] = SWP()->ajax->get_index_stats();

// Determine stemming support
$data['stemming_supported'] = SWP()->is_stemming_supported_in_locale();

$max_weight = apply_filters( 'searchwp_weight_max', 100 );

$enabled_post_types = SWP()->get_enabled_post_types_across_all_engines();

$stats_url = admin_url( 'index.php?page=searchwp-stats' );

if ( class_exists( 'SearchWP_Metrics' ) ) {
	$stats_url = admin_url( 'index.php?page=searchwp-metrics' );
}

$excluded = array();

$excluded_post_types = get_post_types(
	array(
		'exclude_from_search' => true,
		'_builtin'            => false,
	)
);

if ( ! empty( $excluded_post_types ) ) {
	foreach ( $excluded_post_types as $key => $var ) {
		$post_type = get_post_type_object( $key );
		$excluded[ $key ] = array(
			'name'   => $key,
			'label'  => $post_type->label,
			'labels' => $post_type->labels,
		);
	}
}

// Misc data
$data['misc'] = array(
	'max_weight'             => absint( $max_weight ),
	'alternate_indexer'      => SWP()->is_using_alternate_indexer(),
	'initial_settings_saved' => searchwp_get_setting( 'initial_settings' ),
	'legacy_settings'        => searchwp_get_setting( 'legacy_engines' ),
	'index_dirty'            => searchwp_get_setting( 'index_dirty' ),
	'valid_db'               => SWP()->custom_db_tables_exist(),
	'ziparchive'             => class_exists( 'ZipArchive' ),
	'domdocument'            => class_exists( 'DOMDocument' ),
	'empty_engines'          => empty( $enabled_post_types ),
	'stats_url'              => $stats_url,
	'excluded_from_search'   => $excluded,
	'mimes' => array(
		__( 'All Documents', 'searchwp' ),
		__( 'PDFs', 'searchwp' ),
		__( 'Plain Text', 'searchwp' ),
		__( 'Images', 'searchwp' ),
		__( 'Video', 'searchwp' ),
		__( 'Audio', 'searchwp' ),
		__( 'Office Documents', 'searchwp' ),
		__( 'OpenOffice Documents', 'searchwp' ),
		__( 'iWork Documents', 'searchwp' ),
	),
);

$advanced_settings = searchwp_get_option( 'advanced' );
$data['misc']['admin_search'] = ! empty( $advanced_settings['admin_search'] );
$data['misc']['admin_engine'] = isset( $advanced_settings['admin_engine'] ) ? $advanced_settings['admin_engine'] : 'default';

// We need the configurations for all existing engines
$data['engines'] = searchwp_get_setting( 'engines' );

if ( empty( $data['engines'] ) ) {
	$data['engines']['default'] = $data['engine_model'];
	unset( $data['engines']['default']['searchwp_engine_label'] );
}

// Taxonomy rules are stored as CSV strings, but we need formatted objects for Vue dropdowns
$data = SWP()->ajax->normalize_taxonomy_options( $data, 'exclude_' );
$data = SWP()->ajax->normalize_taxonomy_options( $data, 'limit_to_' );

// Ensure that all expected attributes are in place and formatted
$data = SWP()->ajax->normalize_post_types_to_objects( $data );

// Provide Vue with an accurate engine model to use when creating supplemental engines
$data['engine_model'] = SWP()->ajax->generate_engine_model( $data );

SWP()->ajax->enqueue_script(
	'settings',
	array(
		'nonces' => $nonces,
		'data'   => $data,
	)
);

wp_enqueue_style(
	'searchwp-settings',
	trailingslashit( SWP()->url ) . 'assets/js/dist/settings.min.css',
	array(),
	SEARCHWP_VERSION
);

?>

<div id="searchwp-settings"></div>
